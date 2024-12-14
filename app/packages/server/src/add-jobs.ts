import "dotenv/config";
import {DatabaseClient, JobType} from "shared";
import {BossQueueService} from "./queue/boss-queue-service.js";

const main = async () => {
    const databaseClient = new DatabaseClient();
    const queueService = new BossQueueService();
    await queueService.initQueue();

    const type = JobType.IO_TASK;

    const dbJobs = [];
    const queueJobs = [];
    for (let i = 0; i < 10000; i++) {
        const id = crypto.randomUUID();
        dbJobs.push({id, type});
        queueJobs.push({
            id,
            type,
        });
    }

    await databaseClient.addJobsInBatch(dbJobs);
    await queueService.createJobInBatch(queueJobs);

    await databaseClient.close();
    await queueService.stop();
}

main();
