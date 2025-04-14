import { NotFoundError } from "@/errors/not-found-error";

import { auth } from "@/http/middlewares/auth";

import { prisma } from "@/lib/prisma";

import type { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";

const optionalStringSchema = z.string().trim().transform(value => value.length > 0 ? value : null).nullable();
const postalCodeSchema = z.string().trim().regex(/^\d{5}-?\d{3}$/).or(z.literal("").transform(() => null)).nullable();
const ufSchema = z.string().trim().length(2).transform(value => value.toUpperCase()).or(z.literal("").transform(() => null)).nullable();

export async function updateAthleteAddress(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).put("/athletes/:athleteId/address", {
        schema: {
            tags: ["Athletes"],
            summary: "Update an athlete address information",
            security: [{ bearerAuth: [] }],
            params: z.object({
                athleteId: z.string().uuid()
            }),
            body: z.object({
                street: optionalStringSchema,
                neighborhood: optionalStringSchema,
                postalCode: postalCodeSchema,
                complement: optionalStringSchema,
                number: optionalStringSchema,
                city: optionalStringSchema,
                uf: ufSchema,
                country: optionalStringSchema
            }),
            response: {
                204: z.null()
            }
        }
    }, async (request, reply) => {
        await request.getCurrentUserId();

        const { athleteId } = request.params;

        const athlete = await prisma.athlete.findUnique({
            where: { id: athleteId }
        }) 

        if (!athlete) {
            throw new NotFoundError("Atleta não encontrado");
        }

        const { street, neighborhood, postalCode, complement, number, city, uf, country } = request.body;

        await prisma.address.update({
            where: {
                id: athlete.addressId
            },

            data: {
                street,
                neighborhood,
                postalCode,
                complement,
                number,
                city,
                uf,
                country
            }
        })

        return reply.status(204).send();
    })
}
