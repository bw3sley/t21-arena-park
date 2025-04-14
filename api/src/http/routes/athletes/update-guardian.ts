import { NotFoundError } from "@/errors/not-found-error";

import { auth } from "@/http/middlewares/auth";

import { prisma } from "@/lib/prisma";

import type { FastifyInstance } from "fastify";

import type { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";

const optionalStringSchema = z.string().trim().transform(value => value.length > 0 ? value : null).nullable();
const optionalEmailSchema = z.string().trim().email().or(z.literal("").transform(() => null)).nullable();

export async function updateAthleteGuardian(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).put("/athletes/:athleteId/guardian", {
        schema: {
            tags: ["Athletes"],
            summary: "Update an athlete guardian information",
            security: [{ bearerAuth: [] }],
            params: z.object({
                athleteId: z.string().uuid()
            }),
            body: z.object({
                name: optionalStringSchema,
                email: optionalEmailSchema,
                rg: optionalStringSchema,
                cpf: optionalStringSchema,
                relationshipDegree: optionalStringSchema,
                gender: z.enum(["MALE", "FEMALE"]).nullable()
            }),
            response: {
                204: z.null()
            }
        }
    }, async (request, reply) => {
        await request.getCurrentUserId();

        const { athleteId } = request.params;

        const { name, email, rg, cpf, relationshipDegree, gender } = request.body;

        const athlete = await prisma.athlete.findUnique({
            where: { id: athleteId },

            include: { guardian: true }
        })

        if (!athlete) {
            throw new NotFoundError("Atleta não encontrado");
        }

        await prisma.guardian.update({
            where: {  id: athlete.guardian.id },

            data: {
                name,
                email,
                rg,
                cpf,
                relationshipDegree,
                gender
            }
        })

        return reply.status(204).send();
    })
}
