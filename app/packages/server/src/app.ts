import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import Handlebars from "handlebars";
import * as path from "path";
import { getPartialsList } from "./utils/get-partials-list.js";
import "dotenv/config";

export const getFastifyAppInstance = () => {
    const app = Fastify({
        logger: true,
    });

    app.register(fastifyView, {
        engine: {
            handlebars: Handlebars,
        },
        options: {
            partials: getPartialsList(),
        },
        root: path.join(import.meta.dirname, "..", "views"),
    });

    app.register(fastifyStatic, {
        root: path.join(import.meta.dirname, "..", "public"),
    });

    app.register(fastifyMultipart, {
        attachFieldsToBody: true,
        // limit files to 10MB
        limits: { fileSize: 10 * 1024 * 1024 },
    });

    return app;
};
