import sharp from "sharp";
import { StorageClient } from "shared";
import { DatabaseClient } from "shared/dist/db/database-client.js";

export const processImage = async (imageId: string) => {
    const start = new Date().getTime();

    const image = await StorageClient.instance.getObject(
        StorageClient.getImageKey(imageId),
    );

    const sharpObject = sharp(image);

    const blurredImage = await sharpObject.clone().blur(100).jpeg().toBuffer();

    const thumbnail = await sharpObject
        .resize(200, 200, { fit: "inside" })
        .png()
        .toBuffer();

    const blurredImageKey = StorageClient.getBlurredImageKey(imageId);
    await StorageClient.instance.putObject(blurredImageKey, blurredImage);

    const thumbnailKey = StorageClient.getThumbnailKey(imageId);
    await StorageClient.instance.putObject(thumbnailKey, thumbnail);

    const time = new Date().getTime() - start;

    await DatabaseClient.instance.updateImageJob(imageId, {
        processingTime: time,
        thumbnailBucketKey: thumbnailKey,
        blurredBucketKey: blurredImageKey,
    });
};
