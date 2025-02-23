import * as path from "path";
import * as fs from "fs";

export const getPartialsList = () => {
    const partialsDir = path.join(
        import.meta.dirname,
        "..",
        "..",
        "views",
        "partials",
    );
    const files = fs.readdirSync(partialsDir);

    const result: Record<string, string> = {};

    files.forEach((file) => {
        const name = file.split(".")[0];

        result[name] = path.join("partials", file);
    });

    return result;
};
