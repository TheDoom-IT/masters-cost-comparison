import { DatabaseClient, JobData, jobsTable, JobType } from "shared";
import { InferSelectModel } from "drizzle-orm";

export class JobProcessor {
    constructor(private readonly databaseClient: DatabaseClient) {}

    async processTask(data: JobData) {
        const start = new Date().getTime();

        switch (data.type) {
            case JobType.CPU_TASK:
                this.handleCPUTask();
                break;
            case JobType.MEMORY_TASK:
                await this.handleMemoryTaskAlternative();
                break;
            case JobType.IO_TASK:
                await this.handleIOTask();
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

    async handleIOTask(): Promise<InferSelectModel<typeof jobsTable>[]> {
        // This calls DB multiple times to simulate IO operations

        const result = [];

        for (let x = 0; x < 10; x++) {
            const page = await this.databaseClient.getJobs({
                page: x + 1,
                limit: 10,
            });

            result.push(...page.items);
            await new Promise((res) => setTimeout(res, 100));
        }

        return result;
    }

    async handleMemoryTaskAlternative(): Promise<Buffer[]> {
        const buffers: Buffer[] = [];

        for (let x = 0; x < 50; x++) {
            const largeBuffer = Buffer.alloc(1024 * 1024 * 10); // 10 MB of memory
            largeBuffer.fill(1);
            buffers.push(largeBuffer);
            await new Promise((res) => setTimeout(res, 10));
        }

        return buffers;
    }

    handleMemoryTask(): { data: string }[] {
        // This produces around 500MB of memory usage

        // Create a large array
        const size = 700000;
        const largeArray = new Array(size);

        // Fill the array with large objects
        for (let i = 0; i < size; i++) {
            const data = "a".repeat(1024 * 1024);
            largeArray.push({ data });
        }

        return largeArray;
    }

    handleCPUTask(): number[] {
        const result: number[] = [];

        // eslint-disable-next-line no-constant-condition
        for (let x = 0; true; x++) {
            if (this.isPrime(x)) {
                result.push(x);
                if (result.length === 20000) {
                    break;
                }
            }
        }

        return result;
    }

    private isPrime(num: number): boolean {
        for (let i = 2; i < num; i++) if (num % i === 0) return false;
        return num > 1;
    }
}
