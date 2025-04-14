import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { createAthlete } from "../../../../test/utils/create-athlete";
import { resetDatabase, seedAreas } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Create athlete observation (E2E)", () => {
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

  test("[POST] /athletes/:athleteId/areas/:areaName/thread/observations", async () => {
    const { member, token } = await createAndAuthenticateMember(app);
    const athlete = await createAthlete(member.id);
    await seedAreas();

    const area = await prisma.area.findUniqueOrThrow({ where: { name: "PSYCHOLOGY" } });

    await prisma.thread.create({
      data: {
        athleteId: athlete.id,
        areaId: area.id,
      },
    });

    const response = await request(app.server)
      .post(`/athletes/${athlete.id}/areas/PSYCHOLOGY/thread/observations`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "  First observation  " });

    expect(response.statusCode).toBe(201);

    const observationOnDatabase = await prisma.observation.findFirst({
      where: { memberId: member.id },
    });

    expect(observationOnDatabase).toEqual(
      expect.objectContaining({ content: "First observation" }),
    );
  });

  test("[POST] /athletes/:athleteId/areas/:areaName/thread/observations with unknown thread", async () => {
    const { member, token } = await createAndAuthenticateMember(app);
    const athlete = await createAthlete(member.id);

    const response = await request(app.server)
      .post(`/athletes/${athlete.id}/areas/PSYCHOLOGY/thread/observations`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "First observation" });

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "Thread não encontrada" });
  });

  test("[POST] /athletes/:athleteId/areas/:areaName/thread/observations without token", async () => {
    const response = await request(app.server)
      .post("/athletes/00000000-0000-0000-0000-000000000000/areas/PSYCHOLOGY/thread/observations")
      .send({ content: "First observation" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });
});
