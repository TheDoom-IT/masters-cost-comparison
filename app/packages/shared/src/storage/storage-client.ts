import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class StorageClient {
    private readonly client: S3Client;
    private readonly publicClient: S3Client;
    private readonly bucketName: string;

    constructor() {
        const credentials = process.env.STORAGE_ENDPOINT
            ? {
                  accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
                  secretAccessKey: process.env.STORAGE_SECRET!,
              }
            : undefined;

        this.bucketName = process.env.BUCKET_NAME!;
        const endpoint = process.env.STORAGE_ENDPOINT;
        const publicEndpoint = process.env.STORAGE_PUBLIC_ENDPOINT;
        const region = process.env.BUCKET_REGION;

        this.client = new S3Client({
            endpoint,
            credentials,
            region,
            forcePathStyle: true,
        });

        if (publicEndpoint) {
            this.publicClient = new S3Client({
                endpoint: publicEndpoint,
                credentials,
                region,
                forcePathStyle: true,
            });
        } else {
            this.publicClient = this.client;
        }
    }

    static getImageKey(imageId: string) {
        return `${imageId}.jpeg`;
    }

    static getBlurredImageKey(imageId: string) {
        return `${imageId}-blurred.jpeg`;
    }

    static getThumbnailKey(imageId: string) {
        return `${imageId}-thumbnail.jpeg`;
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

    async getPresignedUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        return await getSignedUrl(this.publicClient, command, {
            expiresIn: 3600,
        });
    }
}
