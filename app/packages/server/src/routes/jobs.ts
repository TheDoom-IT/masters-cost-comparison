import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { JobType, StorageClient } from "shared";
import * as crypto from "crypto";
import { DatabaseClient } from "shared";
import { QueueServiceInterface } from "../queue/queue-service-interface.js";

export const applyJobsRoutes = (
    fastify: FastifyInstance,
    databaseClient: DatabaseClient,
    storageClient: StorageClient,
    queueService: QueueServiceInterface,
) => {
    fastify.get(
        "/jobs/home",
        function (request: FastifyRequest, reply: FastifyReply) {
            reply.view("jobs/home");
        },
    );

    fastify.get(
        "/jobs",
        async function (request: FastifyRequest, reply: FastifyReply) {
            const allJobs = await databaseClient.getImageJobs();
            const jobs = await Promise.all(
                allJobs.map(async (job) => ({
                    id: job.id,
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
            return reply.viewAsync("jobs/index", { jobs });
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
            const name: string = body.name.value;
            const type: JobType = body.type.value;
            const fileBuffer = await body.file.toBuffer();

            const id = crypto.randomUUID();
            await storageClient.putObject(
                StorageClient.getImageKey(id),
                fileBuffer,
            );

            await databaseClient.addImageJob(id, StorageClient.getImageKey(id));

            const jobData = {
                name,
                type,
                imageId: id,
            };

            await queueService.createJob(jobData);

            reply.redirect("/jobs");
        },
    );
};
