import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { createAthlete } from "../../../../test/utils/create-athlete";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Update form answer (E2E)", () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  test("[PUT] /athletes/:athleteId/forms/:slug/answers creates answer", async () => {
    const { member, token } = await createAndAuthenticateMember(app);
    const athlete = await createAthlete(member.id);
    const { athleteForm, questions } = await createFormForAthlete(athlete.id);

    const response = await request(app.server)
      .put(`/athletes/${athlete.id}/forms/anamnesis/answers`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        questions: [
          { id: questions[0].id, answer: "Answer 1", observation: "Observation 1" },
          { id: questions[1].id, answer: ["option-a"] },
        ],
      });

    expect(response.statusCode).toBe(204);

    const answerOnDatabase = await prisma.answer.findUnique({
      where: { athleteFormId: athleteForm.id },
    });

    expect(answerOnDatabase?.data).toEqual({
      [questions[0].id]: { answer: "Answer 1", observation: "Observation 1" },
      [questions[1].id]: { answer: ["option-a"], observation: null },
    });
  });

  test("[PUT] /athletes/:athleteId/forms/:slug/answers updates existing answer", async () => {
    const { member, token } = await createAndAuthenticateMember(app);
    const athlete = await createAthlete(member.id);
    const { athleteForm, questions } = await createFormForAthlete(athlete.id);

    await prisma.answer.create({
      data: {
        athleteFormId: athleteForm.id,
        data: {
          [questions[0].id]: { answer: "Old answer", observation: null },
        },
      },
    });

    const response = await request(app.server)
      .put(`/athletes/${athlete.id}/forms/anamnesis/answers`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        questions: [{ id: questions[0].id, answer: "New answer", observation: "" }],
      });

    expect(response.statusCode).toBe(204);

    const answerOnDatabase = await prisma.answer.findUnique({
      where: { athleteFormId: athleteForm.id },
    });

    expect(answerOnDatabase?.data).toEqual({
      [questions[0].id]: { answer: "New answer", observation: null },
    });
  });

  test("[PUT] /athletes/:athleteId/forms/:slug/answers with unknown question", async () => {
    const { member, token } = await createAndAuthenticateMember(app);
    const athlete = await createAthlete(member.id);
    await createFormForAthlete(athlete.id);

    const response = await request(app.server)
      .put(`/athletes/${athlete.id}/forms/anamnesis/answers`)
      .set("Authorization", `Bearer ${token}`)
      .send({ questions: [{ id: 999, answer: "Answer" }] });

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "Pergunta não encontrada para o formulário" });
  });

  test("[PUT] /athletes/:athleteId/forms/:slug/answers without token", async () => {
    const response = await request(app.server)
      .put("/athletes/00000000-0000-0000-0000-000000000000/forms/anamnesis/answers")
      .send({ questions: [{ id: 1, answer: "Answer" }] });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });
});

async function createFormForAthlete(athleteId: string) {
  const form = await prisma.form.create({
    data: {
      name: "Anamnese",
      slug: "anamnesis",
      sections: {
        create: {
          title: "Informacoes do atleta",
          icon: "HeartHandshake",
          questions: {
            create: [
              { title: "Pergunta 1", type: "INPUT" },
              { title: "Pergunta 2", type: "MULTI_SELECT" },
            ],
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

  return { athleteForm, questions: form.sections[0].questions };
}
