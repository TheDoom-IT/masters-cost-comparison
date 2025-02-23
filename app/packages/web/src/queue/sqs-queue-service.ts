import { JobData } from "shared";
import { QueueServiceInterface } from "./queue-service-interface.js";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class SQSQueueService implements QueueServiceInterface {
    private readonly client: SQSClient;
    private readonly queueUrl: string;

    constructor() {
        this.client = new SQSClient();
        this.queueUrl = process.env.SQS_QUEUE_URL!;
    }

    async createJob(jobData: JobData): Promise<string> {
        const command = new SendMessageCommand({
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(jobData),
        });

        const result = await this.client.send(command);
        if (result.MessageId === undefined) {
            throw new Error("Failed to create job");
        }
        return result.MessageId;
    }
}
