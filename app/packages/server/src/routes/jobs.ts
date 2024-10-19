import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const applyJobsRoutes = (fastify: FastifyInstance) => {
  fastify.get(
    "/jobs/home",
    function (request: FastifyRequest, reply: FastifyReply) {
      reply.view("jobs/home");
    },
  );
};
