import { JobData } from "shared";

export interface QueueServiceInterface {
    createJob(jobData: JobData): Promise<string>;
}
