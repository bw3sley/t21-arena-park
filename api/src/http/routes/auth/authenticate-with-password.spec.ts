import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Authenticate with password (E2E)", () => {
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

  test("[POST] /sessions", async () => {
    await createAndAuthenticateMember(app, { email: "john@example.com" });

    const response = await request(app.server).post("/sessions").send({
      email: "john@example.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ token: expect.any(String) });
  });

  test("[POST] /sessions with invalid credentials", async () => {
    await createAndAuthenticateMember(app, { email: "john@example.com" });

    const response = await request(app.server).post("/sessions").send({
      email: "john@example.com",
      password: "invalid-password",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "Credenciais inválidas" });
  });

  test("[POST] /sessions with unknown email", async () => {
    const response = await request(app.server).post("/sessions").send({
      email: "unknown@example.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "Credenciais inválidas" });
  });

  test("[POST] /sessions with invalid payload", async () => {
    const response = await request(app.server).post("/sessions").send({
      email: "invalid-email",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation error");
  });
});
