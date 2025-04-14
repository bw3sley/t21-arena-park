import { prisma } from "@/lib/prisma";

export async function createAthlete(memberId: string) {
  return prisma.athlete.create({
    data: {
      name: "Jane Doe",
      gender: "FEMALE",
      handedness: "RIGHT",
      bloodType: "O_POSITIVE",
      birthDate: new Date(2000, 0, 1),
      member: { connect: { id: memberId } },
      address: { create: {} },
      guardian: { create: {} },
    },
  });
}
