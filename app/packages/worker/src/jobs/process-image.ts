import sharp from "sharp";
import { StorageClient } from "shared";

export const processImage = async (imageId: string) => {
    const start = new Date().getTime();

    const image = await StorageClient.instance.getObject(imageId);

    const size = image.length / 1024 / 1024;

    const sharpObject = sharp(image);

    const blurredImage = await sharpObject.clone().blur(100).jpeg().toBuffer();

    const thumbnail = await sharpObject.resize(200, 200).jpeg().toBuffer();

    await StorageClient.instance.putObject(
        StorageClient.getBlurredImageKey(imageId),
        blurredImage,
    );

    await StorageClient.instance.putObject(
        StorageClient.getThumbnailKey(imageId),
        thumbnail,
    );

    // TODO: save it in db

    const time = new Date().getTime() - start;

    return {
        result: "success",
        size,
        blurredSize: blurredImage.length / 1024 / 1024,
        thumbnailSize: thumbnail.length / 1024 / 1024,
        time,
    };
};
