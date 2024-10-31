import { JobType } from "./job-type-enum.js";

export interface JobData {
    type: JobType;
    imageId: string;
}
