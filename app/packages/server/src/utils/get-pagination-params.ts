import { FastifyRequest } from "fastify";
import { PaginationParams } from "shared";

export const getPaginationParams = (
    request: FastifyRequest,
): PaginationParams => {
    const queryParams = request.query as unknown as Record<string, string>;
    const page = queryParams.page ? parseInt(queryParams.page) : 1;
    return { page, limit: 5 };
};
