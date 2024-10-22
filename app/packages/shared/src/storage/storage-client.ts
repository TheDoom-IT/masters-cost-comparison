import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";

export class StorageClient {
    private readonly client: S3Client;
    private static _instance: StorageClient;

    static getImageKey(imageId: string) {
        return `${imageId}.jpeg`;
    }

    static getBlurredImageKey(imageId: string) {
        return `${imageId}-blurred.jpeg`;
    }

    static getThumbnailKey(imageId: string) {
        return `${imageId}-thumbnail.jpeg`;
    }

    private constructor(
        private readonly bucketName: string,
        endpoint?: string,
        credentials?: {
            accessKeyId: string;
            secretAccessKey: string;
        },
    ) {
        this.client = new S3Client({
            endpoint,
            credentials,
            forcePathStyle: true,
        });
    }

    static get instance(): StorageClient {
        if (!this._instance) {
            const credentials = process.env.STORAGE_ENDPOINT
                ? {
                      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
                      secretAccessKey: process.env.STORAGE_SECRET!,
                  }
                : undefined;

            this._instance = new StorageClient(
                process.env.BUCKET_NAME!,
                process.env.STORAGE_ENDPOINT,
                credentials,
            );
        }

        return this._instance;
    }

    async putObject(key: string, data: Buffer): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: data,
        });

        await this.client.send(command);
    }

    async getObject(key: string): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        const response = await this.client.send(command);
        const body = response.Body;
        if (!body) {
            throw new Error("Key not found");
        }

        const byteArray = await body.transformToByteArray();
        return Buffer.from(byteArray);
    }
}
