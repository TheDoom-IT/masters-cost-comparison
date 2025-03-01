import { DatabaseClient, JobData, jobsTable, JobType } from "shared";
import { InferSelectModel } from "drizzle-orm";

export class JobProcessor {
    constructor(private readonly databaseClient: DatabaseClient) {}

    async processJob(data: JobData) {
        const start = new Date().getTime();

        switch (data.type) {
            case JobType.CPU_JOB:
                this.handleCPUJob();
                break;
            case JobType.MEMORY_JOB:
                await this.handleMemoryJob();
                break;
            case JobType.IO_JOB:
                await this.handleIOJob();
                break;
            default:
                break;
        }

        const time = new Date().getTime() - start;
        await this.databaseClient.updateJob(data.id, {
            processingTime: time,
            processedAt: new Date(),
        });
    }

    // Call DB multiple times to simulate IO operations
    // ================
    // CPU	6%
    // user	0.261s
    // system	0.068s
    // total	5.113s
    // memory	77312K
    async handleIOJob(): Promise<InferSelectModel<typeof jobsTable>[]> {
        const result: InferSelectModel<typeof jobsTable>[] = [];

        for (let x = 0; x < 5; x++) {
            const page = await this.databaseClient.getJobs({
                page: x + 1,
                limit: 10,
            });

            result.push(...page.items);
            await new Promise((res) => setTimeout(res, 800));
        }

        return result;
    }

    // Load 1GB of memory
    // ================
    // CPU	23%
    // user	0.920s
    // system	0.376s
    // total	5.476s
    // memory	1088624K
    async handleMemoryJob(): Promise<Buffer[]> {
        const buffers: Buffer[] = [];

        for (let x = 0; x < 100; x++) {
            const largeBuffer = Buffer.alloc(1024 * 1024 * 10); // 10 MB of memory
            largeBuffer.fill(1);
            buffers.push(largeBuffer);
            await new Promise((res) => setTimeout(res, 45));
        }

        return buffers;
    }

    // Get first 30000 prime numbers
    // ================
    // CPU	100%
    // user	5.632s
    // system	0.059s
    // total	5.674s
    // memory	70848K
    handleCPUJob(): number[] {
        const result: number[] = [];

        for (let x = 0; result.length < 30000; x++) {
            if (this.isPrime(x)) {
                result.push(x);
            }
        }

        return result;
    }

    private isPrime(num: number): boolean {
        for (let i = 2; i < num; i++) {
            if (num % i === 0) {
                return false;
            }
        }
        return num > 1;
    }
}
