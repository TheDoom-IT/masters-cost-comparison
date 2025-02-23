import { applyJobsRoutes } from "./jobs.js";
import { applyHomeRoutes } from "./home.js";
import { FastifyInstance } from "fastify";
import { DatabaseClient } from "shared";
import { QueueServiceInterface } from "../queue/queue-service-interface.js";

export const applyRoutes = (
    fastify: FastifyInstance,
    databaseClient: DatabaseClient,
    queueService: QueueServiceInterface,
) => {
    applyJobsRoutes(fastify, databaseClient, queueService);
    applyHomeRoutes(fastify);
};
