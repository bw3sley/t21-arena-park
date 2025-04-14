import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Get members (E2E)", () => {
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

  test("[GET] /members", async () => {
    const { token } = await createAndAuthenticateMember(app, {
      email: "admin@example.com",
      role: "ADMIN",
    });

    await createAndAuthenticateMember(app, {
      email: "member@example.com",
      role: "MEMBER",
      areas: ["NUTRITION"],
    });

    const response = await request(app.server)
      .get("/members")
      .query({ pageIndex: 0, role: "all" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.members).toEqual([
      expect.objectContaining({
        name: "John Doe",
        email: "member@example.com",
        role: "MEMBER",
        areas: ["NUTRITION"],
      }),
    ]);
    expect(response.body.meta).toEqual({
      pageIndex: 0,
      perPage: 10,
      totalCount: 1,
    });
  });

  test("[GET] /members without token", async () => {
    const response = await request(app.server)
      .get("/members")
      .query({ pageIndex: 0, role: "all" })
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });

  test("[GET] /members filters by member name", async () => {
    const { token } = await createAndAuthenticateMember(app, {
      email: "admin@example.com",
      role: "ADMIN",
    });

    await createAndAuthenticateMember(app, {
      email: "ana@example.com",
      role: "MEMBER",
      areas: ["NUTRITION"],
    });

    await prisma.member.update({
      where: { email: "ana@example.com" },
      data: { name: "Ana Souza" },
    });

    await createAndAuthenticateMember(app, {
      email: "bruno@example.com",
      role: "MEMBER",
      areas: ["PHYSIOTHERAPY"],
    });

    await prisma.member.update({
      where: { email: "bruno@example.com" },
      data: { name: "Bruno Lima" },
    });

    const response = await request(app.server)
      .get("/members")
      .query({ pageIndex: 0, role: "all", memberName: "ana" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.members).toHaveLength(1);
    expect(response.body.members[0]).toEqual(
      expect.objectContaining({ name: "Ana Souza", email: "ana@example.com" }),
    );
    expect(response.body.meta.totalCount).toBe(1);
  });

  test("[GET] /members filters by volunteer role", async () => {
    const { token } = await createAndAuthenticateMember(app, {
      email: "admin@example.com",
      role: "ADMIN",
    });

    await createAndAuthenticateMember(app, {
      email: "admin-two@example.com",
      role: "ADMIN",
    });

    await createAndAuthenticateMember(app, {
      email: "member@example.com",
      role: "MEMBER",
      areas: ["NUTRITION"],
    });

    const response = await request(app.server)
      .get("/members")
      .query({ pageIndex: 0, role: "volunteer" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.members).toEqual([
      expect.objectContaining({ email: "member@example.com", role: "MEMBER" }),
    ]);
    expect(response.body.meta.totalCount).toBe(1);
  });
});
