import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { createAthlete } from "../../../../test/utils/create-athlete";
import { resetDatabase, seedAreas } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Update athlete observation (E2E)", () => {
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

  test("[PUT] /athletes/:athleteId/areas/:areaName/thread/observations/:observationId", async () => {
    const { member, token } = await createAndAuthenticateMember(app);
    const athlete = await createAthlete(member.id);
    const observation = await createObservation(member.id, athlete.id);

    const response = await request(app.server)
      .put(`/athletes/${athlete.id}/areas/PSYCHOLOGY/thread/observations/${observation.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "  Updated observation  " });

    expect(response.statusCode).toBe(204);

    const observationOnDatabase = await prisma.observation.findUnique({
      where: { id: observation.id },
    });

    expect(observationOnDatabase?.content).toBe("Updated observation");
  });

  test("[PUT] /athletes/:athleteId/areas/:areaName/thread/observations/:observationId from another member", async () => {
    const { member } = await createAndAuthenticateMember(app, { email: "owner@example.com" });
    const { token } = await createAndAuthenticateMember(app, { email: "other@example.com" });
    const athlete = await createAthlete(member.id);
    const observation = await createObservation(member.id, athlete.id);

    const response = await request(app.server)
      .put(`/athletes/${athlete.id}/areas/PSYCHOLOGY/thread/observations/${observation.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Updated observation" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      message: "Você não tem permissão para atualizar essa observação",
    });
  });

  test("[PUT] /athletes/:athleteId/areas/:areaName/thread/observations/:observationId without token", async () => {
    const response = await request(app.server)
      .put("/athletes/00000000-0000-0000-0000-000000000000/areas/PSYCHOLOGY/thread/observations/1")
      .send({ content: "Updated observation" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });
});

async function createObservation(memberId: string, athleteId: string) {
  await seedAreas();

  const area = await prisma.area.findUniqueOrThrow({ where: { name: "PSYCHOLOGY" } });
  const thread = await prisma.thread.create({
    data: {
      athleteId,
      areaId: area.id,
    },
  });

  return prisma.observation.create({
    data: {
      threadId: thread.id,
      memberId,
      content: "First observation",
    },
  });
}
