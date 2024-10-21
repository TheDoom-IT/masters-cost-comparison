import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const applyHomeRoutes = (fastify: FastifyInstance) => {
    fastify.get("/", function (request: FastifyRequest, reply: FastifyReply) {
        reply.view("index");
    });
};
