import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { JobType, StorageClient } from "shared";
import { QueueService } from "../queue/queue-service.js";
import * as crypto from "crypto";

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

            const id = crypto.randomUUID();
            await StorageClient.instance.putObject(
                StorageClient.getImageKey(id),
                fileBuffer,
            );

            // TODO: save it in db

            const jobData = {
                name,
                type,
                imageId: id,
            };

            await QueueService.instance.createJob(jobData);

            reply.redirect("/jobs");
        },
    );
};
