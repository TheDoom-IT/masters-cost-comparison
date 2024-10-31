import PgBoss from "pg-boss";
import "dotenv/config";
import { DEFAULT_QUEUE, JobData, JobType, StorageClient } from "shared";
import { DatabaseClient } from "shared";
import { JobProcessor } from "./job-processor.js";

const main = async () => {
    const databaseClient = new DatabaseClient();
    const storageClient = new StorageClient();
    const jobProcessor = new JobProcessor(databaseClient, storageClient);

    const boss = new PgBoss({
        connectionString: process.env.DATABASE_URL!,
        supervise: false,
    });

    await boss.start();

    boss.on("error", console.error);

    await boss.work(DEFAULT_QUEUE, { batchSize: 2 }, async (jobs) => {
        console.log(`Received ${jobs.length} jobs.`);

        for (const job of jobs) {
            const data: JobData = job.data as JobData;

            if (data.type === JobType.IMAGE_PROCESSING) {
                await jobProcessor.processImage(data.imageId);
            }
        }
    });
};

main();
