import PgBoss from "pg-boss";
import { DEFAULT_QUEUE, JobData } from "shared";
import { QueueServiceInterface } from "./queue-service-interface.js";

export class BossQueueService implements QueueServiceInterface {
    private readonly boss: PgBoss;

    constructor() {
        this.boss = new PgBoss(process.env.DATABASE_URL!);

        // TODO: add better error handling/real logger here
        this.boss.on("error", console.error);
    }

    async initQueue() {
        await this.boss.start();
        await this.boss.createQueue(DEFAULT_QUEUE);
    }

    async createJob(jobData: JobData): Promise<string> {
        const newJob = await this.boss.send(DEFAULT_QUEUE, jobData);
        if (newJob === null) {
            throw new Error("Failed to create job");
        }

        return newJob;
    }
}
