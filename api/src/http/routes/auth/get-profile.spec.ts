import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Get profile (E2E)", () => {
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

  test("[GET] /profile", async () => {
    const { member, token } = await createAndAuthenticateMember(app, {
      email: "john@example.com",
      areas: ["PSYCHOLOGY", "NUTRITION"],
    });

    const response = await request(app.server)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: member.id,
      name: "John Doe",
      email: "john@example.com",
      role: "ADMIN",
      avatarUrl: null,
      cpf: null,
      phone: "11999999999",
      gender: null,
      birthDate: null,
      areas: expect.arrayContaining([{ name: "PSYCHOLOGY" }, { name: "NUTRITION" }]),
    });
  });

  test("[GET] /profile without token", async () => {
    const response = await request(app.server).get("/profile").send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });
});
