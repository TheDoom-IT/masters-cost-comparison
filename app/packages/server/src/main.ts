import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import Handlebars from "handlebars";
import * as path from "path";
import { getPartialsList } from "./utils/get-partials-list.js";
import { applyJobsRoutes } from "./routes/jobs.js";
import "dotenv/config";
import { applyHomeRoutes } from "./routes/home.js";
import { QueueService } from "./queue/queue-service.js";

const main = async () => {
    const fastify = Fastify({
        logger: false,
    });

    fastify.register(fastifyView, {
        engine: {
            handlebars: Handlebars,
        },
        options: {
            partials: getPartialsList(),
        },
        root: path.join(import.meta.dirname, "..", "views"),
    });

    fastify.register(fastifyStatic, {
        root: path.join(import.meta.dirname, "..", "public"),
    });

    fastify.register(fastifyMultipart, {
        attachFieldsToBody: true,
        // limit files to 10MB
        limits: { fileSize: 10 * 1024 * 1024 },
    });

    applyHomeRoutes(fastify);
    applyJobsRoutes(fastify);

    await QueueService.instance.initQueue();

    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

main();
