import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Remove member (E2E)", () => {
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

  test("[DELETE] /members/:memberId", async () => {
    const { token } = await createAndAuthenticateMember(app, {
      email: "admin@example.com",
      role: "ADMIN",
    });
    const { member } = await createAndAuthenticateMember(app, {
      email: "member@example.com",
      areas: ["NUTRITION"],
    });

    const response = await request(app.server)
      .delete(`/members/${member.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(204);

    const memberOnDatabase = await prisma.member.findUnique({
      where: { id: member.id },
    });

    expect(memberOnDatabase?.deleteAt).toBeInstanceOf(Date);
    expect(await prisma.memberArea.count({ where: { memberId: member.id } })).toBe(0);
  });

  test("[DELETE] /members/:memberId without token", async () => {
    const response = await request(app.server)
      .delete("/members/00000000-0000-0000-0000-000000000000")
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });
});
