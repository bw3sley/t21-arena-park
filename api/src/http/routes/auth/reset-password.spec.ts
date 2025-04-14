import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import { compare } from "bcryptjs";
import request from "supertest";

describe("Reset password (E2E)", () => {
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

  test("[POST] /password/reset", async () => {
    const { member } = await createAndAuthenticateMember(app, {
      email: "john@example.com",
    });

    const token = await prisma.token.create({
      data: {
        memberId: member.id,
        type: "PASSWORD_RECOVER",
      },
    });

    const response = await request(app.server).post("/password/reset").send({
      code: token.id,
      password: "new-password",
    });

    expect(response.statusCode).toBe(204);

    const memberOnDatabase = await prisma.member.findUniqueOrThrow({
      where: { id: member.id },
    });

    expect(await compare("new-password", memberOnDatabase.passwordHash)).toBe(true);
    expect(await prisma.token.findUnique({ where: { id: token.id } })).toBeNull();
  });

  test("[POST] /password/reset with invalid code", async () => {
    const response = await request(app.server).post("/password/reset").send({
      code: "00000000-0000-0000-0000-000000000000",
      password: "new-password",
    });

    expect(response.statusCode).toBe(401);
  });

  test("[POST] /password/reset with short password", async () => {
    const response = await request(app.server).post("/password/reset").send({
      code: "00000000-0000-0000-0000-000000000000",
      password: "123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "Validation error" });
  });
});
