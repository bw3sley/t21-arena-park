import { NotFoundError } from "@/errors/not-found-error";

import { auth } from "@/http/middlewares/auth";

import { prisma } from "@/lib/prisma";

import type { FastifyInstance } from "fastify";

import type { ZodTypeProvider } from "fastify-type-provider-zod";

import z from "zod";

const answerSchema = z.union([z.string(), z.array(z.string())]);

export async function updateFormAnswer(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).put("/athletes/:athleteId/forms/:slug/answers", {
        schema: {
            tags: ["Forms"],
            summary: "Update answers for an athlete's form",
            security: [{ bearerAuth: [] }],
            params: z.object({
                athleteId: z.string().uuid(),
                slug: z.string(),
            }),
            body: z.object({
                questions: z.array(
                    z.object({
                        id: z.coerce.number().int().positive(),
                        answer: answerSchema,
                        observation: z.string().trim().optional(),
                    })
                ).min(1),
            }),
            response: {
                204: z.null(),
            },
        },
    }, async (request, reply) => {
        await request.getCurrentUserId();

        const { athleteId, slug } = request.params;

        const { questions } = request.body;

        const athleteForm = await prisma.athleteForm.findFirst({
            where: {
                athleteId,
                form: { slug },
            },

            include: {
                answer: true,
                form: {
                    include: {
                        sections: {
                            include: {
                                questions: true,
                            },
                        },
                    },
                },
            },
        });

        if (!athleteForm) {
            throw new NotFoundError("Formulário não encontrado para o atleta");
        }

        const formQuestionIds = new Set(athleteForm.form.sections.flatMap(section => section.questions.map(question => question.id)));
        const hasInvalidQuestion = questions.some(question => !formQuestionIds.has(question.id));

        if (hasInvalidQuestion) {
            throw new NotFoundError("Pergunta não encontrada para o formulário");
        }

        const existingData = athleteForm.answer?.data as Record<string, { answer: string | string[], observation?: string | null }> || {};
        const updatedData = { ...existingData };

        questions.forEach((question) => {
            updatedData[question.id.toString()] = {
                answer: question.answer,
                observation: question.observation && question.observation.length > 0 ? question.observation : null,
            };
        });

        const answer = athleteForm.answer;

        if (!answer) {
            await prisma.answer.create({
                data: {
                    data: updatedData,
                    athleteFormId: athleteForm.id
                }
            });
        }
        else {
            await prisma.answer.update({
                where: { id: answer.id },
                data: { data: updatedData }
            });
        }

        return reply.status(204).send();
    });
}
