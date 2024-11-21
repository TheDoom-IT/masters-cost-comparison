import PgBoss from "pg-boss";
import "dotenv/config";
import { DatabaseClient, DEFAULT_QUEUE, JobData } from "shared";
import { JobProcessor } from "./job-processor.js";

const main = async () => {
    const databaseClient = new DatabaseClient();
    const jobProcessor = new JobProcessor(databaseClient);

    const boss = new PgBoss({
        connectionString: process.env.DATABASE_URL!,
        supervise: false,
    });

    await boss.start();

    boss.on("error", console.error);

    const batchSize = process.env.BATCH_SIZE
        ? parseInt(process.env.BATCH_SIZE)
        : 5;

    console.log(`Worker started with batch size: ${batchSize}.`);

    await boss.work(DEFAULT_QUEUE, { batchSize }, async (jobs) => {
        console.log(`Received ${jobs.length} jobs.`);

        for (const job of jobs) {
            const data: JobData = job.data as JobData;

            await jobProcessor.processTask(data);
        }
    });
};

main();
