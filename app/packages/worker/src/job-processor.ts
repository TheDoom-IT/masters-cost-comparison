import { DatabaseClient } from "shared";
import { StorageClient } from "shared";
import sharp from "sharp";

export class JobProcessor {
    constructor(
        private readonly databaseClient: DatabaseClient,
        private readonly storageClient: StorageClient,
    ) {}

    async processImage(imageId: string) {
        const start = new Date().getTime();

        const image = await this.storageClient.getObject(
            StorageClient.getImageKey(imageId),
        );

        const sharpObject = sharp(image);

        const blurredImage = await sharpObject
            .clone()
            .blur(100)
            .jpeg()
            .toBuffer();

        const thumbnail = await sharpObject
            .resize(200, 200, { fit: "inside" })
            .png()
            .toBuffer();

        const blurredImageKey = StorageClient.getBlurredImageKey(imageId);
        await this.storageClient.putObject(blurredImageKey, blurredImage);

        const thumbnailKey = StorageClient.getThumbnailKey(imageId);
        await this.storageClient.putObject(thumbnailKey, thumbnail);

        const time = new Date().getTime() - start;

        await this.databaseClient.updateImageJob(imageId, {
            processingTime: time,
            processedAt: new Date(),
            thumbnailBucketKey: thumbnailKey,
            blurredBucketKey: blurredImageKey,
        });
    }
}
