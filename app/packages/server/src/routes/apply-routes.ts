import { applyJobsRoutes } from "./jobs.js";
import { applyHomeRoutes } from "./home.js";
import { FastifyInstance } from "fastify";
import { DatabaseClient } from "shared";
import { StorageClient } from "shared";
import { QueueServiceInterface } from "../queue/queue-service-interface.js";

export const applyRoutes = (
    fastify: FastifyInstance,
    databaseClient: DatabaseClient,
    storageClient: StorageClient,
    queueService: QueueServiceInterface,
) => {
    applyJobsRoutes(fastify, databaseClient, storageClient, queueService);
    applyHomeRoutes(fastify);
};
