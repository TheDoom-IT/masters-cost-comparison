import "dotenv/config";
import { getFastifyAppInstance } from "./app.js";
import { DatabaseClient } from "shared";
import { BossQueueService } from "./queue/boss-queue-service.js";
import { applyRoutes } from "./routes/apply-routes.js";

const databaseClient = new DatabaseClient();
await databaseClient.migrate();
const queueService = new BossQueueService();
await queueService.initQueue();

const app = getFastifyAppInstance();
applyRoutes(app, databaseClient, queueService);

try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
    app.log.error(err);
    process.exit(1);
}
