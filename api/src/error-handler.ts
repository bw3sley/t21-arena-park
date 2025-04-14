import type { FastifyInstance } from "fastify";

import { ZodError } from "zod";

import { BadRequestError } from "./errors/bad-request-error";
import { UnauthorizedError } from "./errors/unauthorized-error";
import { NotFoundError } from "./errors/not-found-error";

import { env } from "./env";

type FastifyErrorHandler = FastifyInstance["errorHandler"]

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({ message: "Validation error", errors: error.flatten().fieldErrors });
    }

    if (error.validation) {
        return reply.status(400).send({ message: "Validation error" });
    }

    if (error instanceof BadRequestError) {
        return reply.status(400).send({ message: error.message });
    }

    if (error instanceof UnauthorizedError) {
        return reply.status(401).send({ message: error.message });
    }

    if (error instanceof NotFoundError) {
        return reply.status(404).send({ message: error.message });
    }
    
    if (error.statusCode === 429) {
        return reply.status(429).send({ message: "Too many requests" });
    }

    if (env.NODE_ENV === "dev") {
        console.error(error);
    }

    return reply.status(500).send({ message: "Internal server error" })
}
