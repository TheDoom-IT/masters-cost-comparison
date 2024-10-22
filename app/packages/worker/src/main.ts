import PgBoss from "pg-boss";
import "dotenv/config";
import { DEFAULT_QUEUE, JobData, JobType } from "shared";
import { processImage } from "./jobs/process-image.js";

const main = async () => {
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

            console.log(`Processing job ${job.id} with name ${data.name}`);

            if (data.type === JobType.IMAGE_PROCESSING) {
                const result = await processImage(data.imageId);
                console.log(result);
            }
        }
    });
};

main();
