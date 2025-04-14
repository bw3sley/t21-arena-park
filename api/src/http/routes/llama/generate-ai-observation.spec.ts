import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { createAthlete } from "../../../../test/utils/create-athlete";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";
import { beforeEach, vi } from "vitest";

const { createCompletionMock } = vi.hoisted(() => ({
  createCompletionMock: vi.fn(),
}));

vi.mock("@/lib/openai", () => ({
  client: {
    chat: {
      completions: {
        create: createCompletionMock,
      },
    },
  },
}));

describe("Generate AI observation (E2E)", () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await resetDatabase();
    createCompletionMock.mockReset();
    createCompletionMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: "Observação gerada pela IA.",
          },
        },
      ],
    });
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  test("[POST] /athletes/:athleteId/anamnesis/ai-observation", async () => {
    const { member, token } = await createAndAuthenticateMember(app);
    const athlete = await createAthlete(member.id);
    const athleteForm = await createAnsweredAnamnesis(athlete.id, 4);

    const response = await request(app.server)
      .post(`/athletes/${athlete.id}/anamnesis/ai-observation`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ observation: "Observação gerada pela IA." });
    expect(createCompletionMock).toHaveBeenCalledTimes(1);

    const athleteFormOnDatabase = await prisma.athleteForm.findUnique({
      where: { id: athleteForm.id },
    });

    expect(athleteFormOnDatabase?.IAObservation).toBe("Observação gerada pela IA.");
  });

  test("[POST] /athletes/:athleteId/anamnesis/ai-observation with incomplete anamnesis", async () => {
    const { member, token } = await createAndAuthenticateMember(app);
    const athlete = await createAthlete(member.id);
    await createAnsweredAnamnesis(athlete.id, 3);

    const response = await request(app.server)
      .post(`/athletes/${athlete.id}/anamnesis/ai-observation`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "Atleta não tem 80% da anamnese feito" });
    expect(createCompletionMock).not.toHaveBeenCalled();
  });

  test("[POST] /athletes/:athleteId/anamnesis/ai-observation without token", async () => {
    const response = await request(app.server)
      .post("/athletes/00000000-0000-0000-0000-000000000000/anamnesis/ai-observation")
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
    expect(createCompletionMock).not.toHaveBeenCalled();
  });
});

async function createAnsweredAnamnesis(athleteId: string, answeredQuestions: number) {
  const form = await prisma.form.create({
    data: {
      name: "Anamnese",
      slug: "anamnesis",
      sections: {
        create: {
          title: "Informacoes do atleta",
          icon: "HeartHandshake",
          questions: {
            create: Array.from({ length: 5 }, (_, index) => ({
              title: `Pergunta ${index + 1}`,
              type: "INPUT",
            })),
          },
        },
      },
    },
    include: {
      sections: {
        include: { questions: true },
      },
    },
  });

  const athleteForm = await prisma.athleteForm.create({
    data: {
      athleteId,
      formId: form.id,
    },
  });

  const data = Object.fromEntries(
    form.sections[0].questions.map((question, index) => [
      question.id,
      { answer: index < answeredQuestions ? "Resposta" : "" },
    ]),
  );

  await prisma.answer.create({
    data: {
      athleteFormId: athleteForm.id,
      data,
    },
  });

  return athleteForm;
}
