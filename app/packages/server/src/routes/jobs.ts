import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { JobType } from "shared";
import { QueueService } from "../queue/queue-service.js";

export const applyJobsRoutes = (fastify: FastifyInstance) => {
    fastify.get(
        "/jobs/home",
        function (request: FastifyRequest, reply: FastifyReply) {
            reply.view("jobs/home");
        },
    );

    fastify.get(
        "/jobs",
        function (request: FastifyRequest, reply: FastifyReply) {
            reply.view("jobs/index");
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

            const jobData = {
                name,
                type,
                file: fileBuffer.toString("base64"),
            };

            await QueueService.instance.createJob(jobData);

            reply.redirect("/jobs");
        },
    );
};
