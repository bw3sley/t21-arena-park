import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Remove athlete (E2E)", () => {
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

  test("[DELETE] /athletes/:athleteId", async () => {
    const { member, token } = await createAndAuthenticateMember(app);

    const athlete = await prisma.athlete.create({
      data: {
        name: "Jane Doe",
        gender: "FEMALE",
        handedness: "RIGHT",
        bloodType: "O_POSITIVE",
        birthDate: new Date(2000, 0, 1),
        member: { connect: { id: member.id } },
        address: { create: {} },
        guardian: { create: {} },
      },
    });

    const response = await request(app.server)
      .delete(`/athletes/${athlete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(204);

    const athleteOnDatabase = await prisma.athlete.findUnique({
      where: { id: athlete.id },
    });

    expect(athleteOnDatabase?.deletedAt).toBeInstanceOf(Date);
  });

  test("[DELETE] /athletes/:athleteId without token", async () => {
    const response = await request(app.server)
      .delete("/athletes/00000000-0000-0000-0000-000000000000")
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });
});
