import { prisma } from "@/lib/prisma";
import { Role, Specialties } from "@prisma/client";
import { hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";

import { seedAreas } from "./prisma-test-environment";

interface CreateAndAuthenticateMemberOptions {
  email?: string;
  role?: Role;
  areas?: Specialties[];
}

export async function createAndAuthenticateMember(
  app: FastifyInstance,
  options: CreateAndAuthenticateMemberOptions = {},
) {
  const email = options.email ?? "john@example.com";
  const role = options.role ?? "ADMIN";
  const areas = options.areas ?? ["PSYCHOLOGY"];

  await seedAreas();

  const passwordHash = await hash("123456", 6);

  const member = await prisma.member.create({
    data: {
      name: "John Doe",
      email,
      passwordHash,
      phone: "11999999999",
      role,
      areas: {
        create: areas.map((areaName) => ({
          area: {
            connect: { name: areaName },
          },
        })),
      },
    },
    include: {
      areas: {
        include: {
          area: true,
        },
      },
    },
  });

  const token = app.jwt.sign({
    sub: member.id,
    role: member.role,
    area: member.areas.map((item) => item.area.name),
  });

  return { member, token };
}
