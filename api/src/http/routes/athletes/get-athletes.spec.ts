import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Get athletes (E2E)", () => {
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

  test("[GET] /athletes", async () => {
    const { member, token } = await createAndAuthenticateMember(app);

    await prisma.athlete.create({
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
      .get("/athletes")
      .query({ pageIndex: 0, gender: "all" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.athletes).toEqual([
      expect.objectContaining({
        name: "Jane Doe",
        gender: "FEMALE",
        handedness: "RIGHT",
        bloodType: "O_POSITIVE",
        birthDate: "01/01/2000",
      }),
    ]);
    expect(response.body.meta).toEqual({
      pageIndex: 0,
      perPage: 10,
      totalCount: 1,
    });
  });

  test("[GET] /athletes filters by gender and name", async () => {
    const { member, token } = await createAndAuthenticateMember(app);

    await prisma.athlete.create({
      data: {
        name: "Ana Souza",
        gender: "FEMALE",
        handedness: "RIGHT",
        bloodType: "O_POSITIVE",
        birthDate: new Date(2000, 0, 1),
        member: { connect: { id: member.id } },
        address: { create: {} },
        guardian: { create: {} },
      },
    });

    await prisma.athlete.create({
      data: {
        name: "Bruno Lima",
        gender: "MALE",
        handedness: "LEFT",
        bloodType: "A_POSITIVE",
        birthDate: new Date(2001, 0, 1),
        member: { connect: { id: member.id } },
        address: { create: {} },
        guardian: { create: {} },
      },
    });

    const response = await request(app.server)
      .get("/athletes")
      .query({ pageIndex: 0, gender: "female", athleteName: "ana" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.athletes).toHaveLength(1);
    expect(response.body.athletes[0]).toEqual(
      expect.objectContaining({ name: "Ana Souza", gender: "FEMALE" }),
    );
    expect(response.body.meta.totalCount).toBe(1);
  });

  test("[GET] /athletes without token", async () => {
    const response = await request(app.server)
      .get("/athletes")
      .query({ pageIndex: 0, gender: "all" })
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });
});
