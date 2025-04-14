import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { createAthlete } from "../../../../test/utils/create-athlete";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";

describe("Update athlete address (E2E)", () => {
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

  test("[PUT] /athletes/:athleteId/address", async () => {
    const { member, token } = await createAndAuthenticateMember(app);
    const athlete = await createAthlete(member.id);

    const response = await request(app.server)
      .put(`/athletes/${athlete.id}/address`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: "Rua Um",
        neighborhood: "Centro",
        postalCode: "12345-678",
        complement: "Apto 1",
        number: "10",
        city: "Sao Paulo",
        uf: "sp",
        country: "Brasil",
      });

    expect(response.statusCode).toBe(204);

    const addressOnDatabase = await prisma.address.findUnique({
      where: { id: athlete.addressId },
    });

    expect(addressOnDatabase).toEqual(
      expect.objectContaining({
        street: "Rua Um",
        neighborhood: "Centro",
        postalCode: "12345-678",
        complement: "Apto 1",
        number: "10",
        city: "Sao Paulo",
        uf: "SP",
        country: "Brasil",
      }),
    );
  });

  test("[PUT] /athletes/:athleteId/address with empty fields", async () => {
    const { member, token } = await createAndAuthenticateMember(app);
    const athlete = await createAthlete(member.id);

    const response = await request(app.server)
      .put(`/athletes/${athlete.id}/address`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: "",
        neighborhood: "",
        postalCode: "",
        complement: "",
        number: "",
        city: "",
        uf: "",
        country: "",
      });

    expect(response.statusCode).toBe(204);

    const addressOnDatabase = await prisma.address.findUnique({
      where: { id: athlete.addressId },
    });

    expect(addressOnDatabase).toEqual(
      expect.objectContaining({
        street: null,
        neighborhood: null,
        postalCode: null,
        complement: null,
        number: null,
        city: null,
        uf: null,
        country: null,
      }),
    );
  });

  test("[PUT] /athletes/:athleteId/address without token", async () => {
    const response = await request(app.server)
      .put("/athletes/00000000-0000-0000-0000-000000000000/address")
      .send({
        street: null,
        neighborhood: null,
        postalCode: null,
        complement: null,
        number: null,
        city: null,
        uf: null,
        country: null,
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Token inválido" });
  });
});
