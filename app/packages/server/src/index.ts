import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import Handlebars from "handlebars";
import * as path from "path";
import { getPartialsList } from "./utils/get-partials-list.js";
import { applyJobsRoutes } from "./routes/jobs.js";

const fastify = Fastify({
  logger: true,
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

applyJobsRoutes(fastify);

fastify.get("/", function (request: FastifyRequest, reply: FastifyReply) {
  reply.view("index");
});

const main = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

main();
