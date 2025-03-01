import { JobData } from "shared";
import { DatabaseClient } from "shared";
import { JobProcessor } from "./job-processor.js";

const databaseClient = new DatabaseClient();
const jobProcessor = new JobProcessor(databaseClient);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async (event: any) => {
    console.log(`Received ${event.Records.length} jobs.`);

    const batchItemFailures: { itemIdentifier: string }[] = [];
    await Promise.all(
        event.Records.map(
            async (record: { body: unknown; messageId: string }) => {
                try {
                    return await processJob(record.body);
                } catch (error) {
                    console.log(
                        `Failed to process job ${record.messageId}: ${error}`,
                    );
                    batchItemFailures.push({
                        itemIdentifier: record.messageId,
                    });
                }
            },
        ),
    );

    return { batchItemFailures };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processJob = async (jobData: any) => {
    const data: JobData = JSON.parse(jobData);

    await jobProcessor.processJob(data);
};
