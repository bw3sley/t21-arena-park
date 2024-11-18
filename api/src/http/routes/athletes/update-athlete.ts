import { NotFoundError } from "@/errors/not-found-error";
import { auth } from "@/http/middlewares/auth";

import { prisma } from "@/lib/prisma";

import type { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";

const birthDateSchema = z.coerce.date().refine(date => date <= new Date(), { message: "Data de nascimento não pode ser futura" });

export async function updateAthlete(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).put("/athletes/:athleteId", {
        schema: {
            tags: ["Athletes"],
            summary: "Update an athlete",
            security: [{ bearerAuth: [] }],
            params: z.object({
                athleteId: z.string().uuid()
            }),
            body: z.object({
                name: z.string().trim().min(1),
                gender: z.enum(["MALE", "FEMALE"]),
                handedness: z.enum(["RIGHT", "LEFT"]),
                bloodType: z.enum([
                    "A_POSITIVE",
                    "A_NEGATIVE",
                    "B_POSITIVE",
                    "B_NEGATIVE",
                    "AB_POSITIVE",
                    "AB_NEGATIVE",
                    "O_POSITIVE",
                    "O_NEGATIVE"
                ]),
                birthDate: birthDateSchema
            }),
            response: {
                204: z.null()
            }
        }
    }, async (request, reply) => {
        const { athleteId } = request.params;

        const athlete = await prisma.athlete.findUnique({
            where: { id: athleteId }
        })

        if (!athlete) {
            throw new NotFoundError("Atleta não encontrado");
        }

        const { name, gender, handedness, bloodType, birthDate } = request.body;

        await prisma.athlete.update({
            where: { id: athleteId },

            data: {
                name,
                gender,
                handedness,
                bloodType,
                birthDate
            }
        })

        return reply.status(204).send();
    })
}
