import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Update member (E2E)", () => {
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

  test("[PUT] /members/:memberId", async () => {
    const { token } = await createAndAuthenticateMember(app, {
      email: "admin@example.com",
      role: "ADMIN",
    });
    const { member } = await createAndAuthenticateMember(app, {
      email: "member@example.com",
      areas: ["PSYCHOLOGY"],
    });

    const response = await request(app.server)
      .put(`/members/${member.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "  Updated Member  ",
        email: "updated@example.com",
        phone: "11888888888",
        role: "MEMBER",
        areas: ["NUTRITION", "PHYSIOTHERAPY"],
      });

    expect(response.statusCode).toBe(204);

    const memberOnDatabase = await prisma.member.findUnique({
      where: { id: member.id },
      include: { areas: { include: { area: true } } },
    });

    expect(memberOnDatabase).toEqual(
      expect.objectContaining({
        name: "Updated Member",
        email: "updated@example.com",
        phone: "11888888888",
        role: "MEMBER",
      }),
    );
    expect(memberOnDatabase?.areas.map((item) => item.area.name).sort()).toEqual([
      "NUTRITION",
      "PHYSIOTHERAPY",
    ]);
  });

  test("[PUT] /members/:memberId with duplicate areas", async () => {
    const { member, token } = await createAndAuthenticateMember(app);

    const response = await request(app.server)
      .put(`/members/${member.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe",
        email: "john@example.com",
        phone: "11999999999",
        role: "MEMBER",
        areas: ["NUTRITION", "NUTRITION"],
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "Validation error" });
  });

  test("[PUT] /members/:memberId without token", async () => {
    const response = await request(app.server)
      .put("/members/00000000-0000-0000-0000-000000000000")
      .send({
        name: "John Doe",
        email: "john@example.com",
        phone: "11999999999",
        role: "MEMBER",
        areas: ["NUTRITION"],
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });
});
