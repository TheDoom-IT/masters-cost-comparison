import sharp from "sharp";

export const processImage = async (image: Buffer) => {
    const start = new Date().getTime();

    const size = image.length / 1024 / 1024;

    const sharpObject = sharp(image);

    const blurredImage = await sharpObject.clone().blur(100).jpeg().toBuffer();

    const thumbnail = await sharpObject.resize(200, 200).jpeg().toBuffer();

    // TODO: save file to storage

    const time = new Date().getTime() - start;

    return {
        result: "success",
        size,
        blurredSize: blurredImage.length / 1024 / 1024,
        thumbnailSize: thumbnail.length / 1024 / 1024,
        time,
    };
};
