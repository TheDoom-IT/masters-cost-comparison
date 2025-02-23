import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { JobType } from "shared";
import { DatabaseClient } from "shared";
import { QueueServiceInterface } from "../queue/queue-service-interface.js";
import { formatDate } from "../utils/format-date.js";
import { getPaginationParams } from "../utils/get-pagination-params.js";

export const applyJobsRoutes = (
    fastify: FastifyInstance,
    databaseClient: DatabaseClient,
    queueService: QueueServiceInterface,
) => {
    fastify.get(
        "/jobs",
        async function (request: FastifyRequest, reply: FastifyReply) {
            const pagination = getPaginationParams(request);

            const allJobs = await databaseClient.getJobs(pagination);
            const jobs = allJobs.items.map((job) => ({
                id: job.id,
                type: job.type,
                processedAt: job.processedAt
                    ? formatDate(job.processedAt)
                    : undefined,
                createdAt: formatDate(job.createdAt),
                processingTime: job.processingTime,
            }));

            const pages = Math.ceil(allJobs.totalItems / pagination.limit);
            const currentPage = pagination.page;
            return reply.viewAsync("jobs/index", {
                jobs,
                previousPage: currentPage <= 1 ? undefined : currentPage - 1,
                currentPage: currentPage,
                nextPage: currentPage >= pages ? undefined : currentPage + 1,
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
            const type: JobType = body.type;

            if (!Object.values(JobType).includes(type)) {
                reply.code(400).send({ message: "Invalid job type" });
                return;
            }

            const id = crypto.randomUUID();
            await databaseClient.addJob(id, type);

            const jobData = {
                id,
                type,
            };

            await queueService.createJob(jobData);

            reply.redirect("/jobs");
        },
    );
};
