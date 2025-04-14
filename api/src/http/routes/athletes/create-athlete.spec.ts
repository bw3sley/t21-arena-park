import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { resetDatabase, seedAnamnesisForm } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Create athlete (E2E)", () => {
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

  test("[POST] /athletes", async () => {
    const { token } = await createAndAuthenticateMember(app);
    await seedAnamnesisForm();

    const response = await request(app.server)
      .post("/athletes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Jane Doe",
        gender: "FEMALE",
        handedness: "RIGHT",
        bloodType: "O_POSITIVE",
        birthDate: "2000-01-01",
      });

    expect(response.statusCode).toBe(201);

    const athleteOnDatabase = await prisma.athlete.findFirst({
      where: { name: "Jane Doe" },
      include: {
        address: true,
        guardian: true,
        forms: true,
        threads: true,
      },
    });

    expect(athleteOnDatabase).toBeTruthy();
    expect(athleteOnDatabase?.address).toBeTruthy();
    expect(athleteOnDatabase?.guardian).toBeTruthy();
    expect(athleteOnDatabase?.forms).toHaveLength(1);
    expect(athleteOnDatabase?.threads).toHaveLength(7);
  });

  test("[POST] /athletes without token", async () => {
    const response = await request(app.server).post("/athletes").send({
      name: "Jane Doe",
      gender: "FEMALE",
      handedness: "RIGHT",
      bloodType: "O_POSITIVE",
      birthDate: "2000-01-01",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });

  test("[POST] /athletes with future birth date", async () => {
    const { token } = await createAndAuthenticateMember(app);

    const response = await request(app.server)
      .post("/athletes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Jane Doe",
        gender: "FEMALE",
        handedness: "RIGHT",
        bloodType: "O_POSITIVE",
        birthDate: "2999-01-01",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation error");
  });

  test("[POST] /athletes trims athlete name", async () => {
    const { token } = await createAndAuthenticateMember(app);

    const response = await request(app.server)
      .post("/athletes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "  Jane Doe  ",
        gender: "FEMALE",
        handedness: "RIGHT",
        bloodType: "O_POSITIVE",
        birthDate: "2000-01-01",
      });

    expect(response.statusCode).toBe(201);

    const athleteOnDatabase = await prisma.athlete.findFirst({
      where: { name: "Jane Doe" },
    });

    expect(athleteOnDatabase).toBeTruthy();
  });
});
