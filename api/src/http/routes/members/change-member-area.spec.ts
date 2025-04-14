import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Change member area (E2E)", () => {
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

  test("[PATCH] /members/:memberId/change-area", async () => {
    const { token } = await createAndAuthenticateMember(app, {
      email: "admin@example.com",
      role: "ADMIN",
    });
    const { member } = await createAndAuthenticateMember(app, {
      email: "member@example.com",
      areas: ["PSYCHOLOGY"],
    });

    const response = await request(app.server)
      .patch(`/members/${member.id}/change-area`)
      .set("Authorization", `Bearer ${token}`)
      .send({ areas: ["NUTRITION", "PHYSIOTHERAPY"] });

    expect(response.statusCode).toBe(204);

    const memberAreas = await prisma.memberArea.findMany({
      where: { memberId: member.id },
      include: { area: true },
      orderBy: { area: { name: "asc" } },
    });

    expect(memberAreas.map((item) => item.area.name).sort()).toEqual([
      "NUTRITION",
      "PHYSIOTHERAPY",
    ]);
  });

  test("[PATCH] /members/:memberId/change-area with duplicate areas", async () => {
    const { member, token } = await createAndAuthenticateMember(app);

    const response = await request(app.server)
      .patch(`/members/${member.id}/change-area`)
      .set("Authorization", `Bearer ${token}`)
      .send({ areas: ["NUTRITION", "NUTRITION"] });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "Validation error" });
  });

  test("[PATCH] /members/:memberId/change-area without token", async () => {
    const response = await request(app.server)
      .patch("/members/00000000-0000-0000-0000-000000000000/change-area")
      .send({ areas: ["NUTRITION"] });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });
});
