import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { resetDatabase, seedAnamnesisForm } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Get athlete (E2E)", () => {
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

  test("[GET] /athletes/:athleteId", async () => {
    const { member, token } = await createAndAuthenticateMember(app);
    await seedAnamnesisForm();

    const athlete = await prisma.athlete.create({
      data: {
        name: "Jane Doe",
        gender: "FEMALE",
        handedness: "RIGHT",
        bloodType: "O_POSITIVE",
        birthDate: new Date(2000, 0, 1),
        member: { connect: { id: member.id } },
        address: { create: { city: "Sao Paulo", uf: "SP" } },
        guardian: { create: { name: "Mary Doe", email: "mary@example.com" } },
      },
    });

    const form = await prisma.form.findUniqueOrThrow({ where: { slug: "anamnesis" } });

    await prisma.athleteForm.create({
      data: {
        athleteId: athlete.id,
        formId: form.id,
      },
    });

    const response = await request(app.server)
      .get(`/athletes/${athlete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      athlete: expect.objectContaining({
        id: athlete.id,
        name: "Jane Doe",
        gender: "FEMALE",
        handedness: "RIGHT",
        bloodType: "O_POSITIVE",
        birthDate: "01/01/2000",
        observation: null,
      }),
      address: expect.objectContaining({ city: "Sao Paulo", uf: "SP" }),
      guardian: expect.objectContaining({ name: "Mary Doe", email: "mary@example.com" }),
      anamnesis: expect.objectContaining({ progress: 0, slug: "anamnesis" }),
    });
  });

  test("[GET] /athletes/:athleteId with unknown athlete", async () => {
    const { token } = await createAndAuthenticateMember(app);

    const response = await request(app.server)
      .get("/athletes/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "Atleta não encontrado" });
  });

  test("[GET] /athletes/:athleteId without token", async () => {
    const response = await request(app.server)
      .get("/athletes/00000000-0000-0000-0000-000000000000")
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });
});
