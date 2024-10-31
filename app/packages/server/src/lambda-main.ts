import awsLambdaFastify from "@fastify/aws-lambda";
import { getFastifyAppInstance } from "./app.js";
import { DatabaseClient } from "shared";
import { applyRoutes } from "./routes/apply-routes.js";
import { StorageClient } from "shared";
import { SQSQueueService } from "./queue/sqs-queue-service.js";

const databaseClient = new DatabaseClient();
await databaseClient.migrate();
const storageClient = new StorageClient();
const queueService = new SQSQueueService();

const app = getFastifyAppInstance();
applyRoutes(app, databaseClient, storageClient, queueService);

const awsLambdaFastifyInstance = awsLambdaFastify(app);

export const handler = (event: never, context: never) =>
    awsLambdaFastifyInstance(event, context);
await app.ready();
