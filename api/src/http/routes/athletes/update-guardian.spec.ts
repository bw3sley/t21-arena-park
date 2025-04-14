import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { createAthlete } from "../../../../test/utils/create-athlete";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Update athlete guardian (E2E)", () => {
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

  test("[PUT] /athletes/:athleteId/guardian", async () => {
    const { member, token } = await createAndAuthenticateMember(app);
    const athlete = await createAthlete(member.id);

    const response = await request(app.server)
      .put(`/athletes/${athlete.id}/guardian`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Mary Doe",
        email: "mary@example.com",
        rg: "1234567",
        cpf: "12345678900",
        relationshipDegree: "Mother",
        gender: "FEMALE",
      });

    expect(response.statusCode).toBe(204);

    const guardianOnDatabase = await prisma.guardian.findUnique({
      where: { id: athlete.guardianId },
    });

    expect(guardianOnDatabase).toEqual(
      expect.objectContaining({
        name: "Mary Doe",
        email: "mary@example.com",
        rg: "1234567",
        cpf: "12345678900",
        relationshipDegree: "Mother",
        gender: "FEMALE",
      }),
    );
  });

  test("[PUT] /athletes/:athleteId/guardian without token", async () => {
    const response = await request(app.server)
      .put("/athletes/00000000-0000-0000-0000-000000000000/guardian")
      .send({
        name: null,
        email: null,
        rg: null,
        cpf: null,
        relationshipDegree: null,
        gender: null,
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });
});
