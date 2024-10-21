import { JobType } from "./job-type-enum.js";

export interface JobData {
    name: string;
    type: JobType;
    file: string;
}
