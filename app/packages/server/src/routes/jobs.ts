import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { JobType, StorageClient } from "shared";
import * as crypto from "crypto";
import { DatabaseClient } from "shared";
import { QueueServiceInterface } from "../queue/queue-service-interface.js";
import { formatDate } from "../utils/format-date.js";
import { getPaginationParams } from "../utils/get-pagination-params.js";

export const applyJobsRoutes = (
    fastify: FastifyInstance,
    databaseClient: DatabaseClient,
    storageClient: StorageClient,
    queueService: QueueServiceInterface,
) => {
    fastify.get(
        "/jobs",
        async function (request: FastifyRequest, reply: FastifyReply) {
            const pagination = getPaginationParams(request);

            const allJobs = await databaseClient.getImageJobs(pagination);
            const jobs = await Promise.all(
                allJobs.items.map(async (job) => ({
                    id: job.id,
                    processedAt: job.processedAt
                        ? formatDate(job.processedAt)
                        : undefined,
                    createdAt: formatDate(job.createdAt),
                    processingTime: job.processingTime,
                    thumbnail: job.thumbnailBucketKey
                        ? await storageClient.getPresignedUrl(
                              job.thumbnailBucketKey,
                          )
                        : undefined,
                    blurred: job.blurredBucketKey
                        ? await storageClient.getPresignedUrl(
                              job.blurredBucketKey,
                          )
                        : undefined,
                })),
            );

            const pages = Math.ceil(allJobs.totalItems / pagination.limit);
            const currentPage = pagination.page;
            return reply.viewAsync("jobs/index", {
                jobs,
                previousPage: currentPage === 1 ? undefined : currentPage - 1,
                currentPage: currentPage,
                nextPage: currentPage === pages ? undefined : currentPage + 1,
                pages: pages,
            });
        },
    );

    fastify.get(
        "/jobs/create",
        function (request: FastifyRequest, reply: FastifyReply) {
            reply.view("jobs/create", {
                types: Object.values(JobType),
            });
        },
    );

    fastify.post(
        "/jobs",
        async function (request: FastifyRequest, reply: FastifyReply) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const body = request.body as Record<string, any>;
            const type: JobType = body.type.value;
            const fileBuffer = await body.file.toBuffer();

            const id = crypto.randomUUID();
            await storageClient.putObject(
                StorageClient.getImageKey(id),
                fileBuffer,
            );

            await databaseClient.addImageJob(id, StorageClient.getImageKey(id));

            const jobData = {
                type,
                imageId: id,
            };

            await queueService.createJob(jobData);

            reply.redirect("/jobs");
        },
    );
};
