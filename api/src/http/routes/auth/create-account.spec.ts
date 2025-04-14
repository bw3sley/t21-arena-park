import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { resetDatabase, seedAreas } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Create account (E2E)", () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await resetDatabase();
    await seedAreas();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  test("[POST] /members", async () => {
    const response = await request(app.server).post("/members").send({
      name: "John Doe",
      email: "john@example.com",
      phone: "11999999999",
      password: "123456",
      role: "MEMBER",
      areas: ["PSYCHOLOGY"],
    });

    expect(response.statusCode).toBe(201);

    const memberOnDatabase = await prisma.member.findUnique({
      where: { email: "john@example.com" },
      include: {
        areas: {
          include: {
            area: true,
          },
        },
      },
    });

    expect(memberOnDatabase).toBeTruthy();
    expect(memberOnDatabase?.areas).toEqual([
      expect.objectContaining({
        area: expect.objectContaining({ name: "PSYCHOLOGY" }),
      }),
    ]);
  });

  test("[POST] /members with duplicated email", async () => {
    await request(app.server).post("/members").send({
      name: "John Doe",
      email: "john@example.com",
      phone: "11999999999",
      password: "123456",
      role: "MEMBER",
      areas: ["PSYCHOLOGY"],
    });

    const response = await request(app.server).post("/members").send({
      name: "John Doe",
      email: "john@example.com",
      phone: "11999999999",
      password: "123456",
      role: "MEMBER",
      areas: ["PSYCHOLOGY"],
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "Usuário com mesmo e-mail" });
  });

  test("[POST] /members with invalid area", async () => {
    const response = await request(app.server).post("/members").send({
      name: "John Doe",
      email: "john@example.com",
      phone: "11999999999",
      password: "123456",
      role: "MEMBER",
      areas: ["INVALID_AREA"],
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation error");
  });

  test("[POST] /members trims member name", async () => {
    const response = await request(app.server).post("/members").send({
      name: "  John Doe  ",
      email: "john@example.com",
      phone: "11999999999",
      password: "123456",
      role: "MEMBER",
      areas: ["PSYCHOLOGY"],
    });

    expect(response.statusCode).toBe(201);

    const memberOnDatabase = await prisma.member.findUnique({
      where: { email: "john@example.com" },
    });

    expect(memberOnDatabase?.name).toBe("John Doe");
  });
});
