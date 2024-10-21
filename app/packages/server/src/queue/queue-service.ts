import PgBoss from "pg-boss";
import { DEFAULT_QUEUE, JobData } from "shared";

export class QueueService {
    private static _instance: QueueService;
    private readonly boss: PgBoss;

    private constructor() {
        this.boss = new PgBoss(process.env.DATABASE_URL!);

        // TODO: add better error handling/real logger here
        this.boss.on("error", console.error);
    }

    static get instance(): QueueService {
        if (!this._instance) {
            this._instance = new QueueService();
        }

        return this._instance;
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
