import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateMember } from "../../../../test/utils/create-and-authenticate-member";
import { resetDatabase } from "../../../../test/utils/prisma-test-environment";
import request from "supertest";
import { beforeEach, vi } from "vitest";

const sendMailMock = vi.fn();

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: sendMailMock,
    })),
  },
}));

describe("Request password recovery (E2E)", () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await resetDatabase();
    sendMailMock.mockReset();
    sendMailMock.mockResolvedValue({});
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  test("[POST] /password/recover", async () => {
    const { member } = await createAndAuthenticateMember(app, {
      email: "john@example.com",
    });

    const response = await request(app.server).post("/password/recover").send({
      email: "john@example.com",
    });

    expect(response.statusCode).toBe(201);

    const tokenOnDatabase = await prisma.token.findFirst({
      where: { memberId: member.id, type: "PASSWORD_RECOVER" },
    });

    expect(tokenOnDatabase).toBeTruthy();
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  test("[POST] /password/recover with unknown email", async () => {
    const response = await request(app.server).post("/password/recover").send({
      email: "unknown@example.com",
    });

    expect(response.statusCode).toBe(201);
    expect(await prisma.token.count()).toBe(0);
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  test("[POST] /password/recover with invalid email", async () => {
    const response = await request(app.server).post("/password/recover").send({
      email: "invalid-email",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: "Validation error" });
  });
});
