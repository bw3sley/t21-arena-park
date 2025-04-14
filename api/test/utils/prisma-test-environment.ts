import { prisma } from "@/lib/prisma";
import { Specialties } from "@prisma/client";

export async function resetDatabase() {
  await prisma.observation.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.athleteForm.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.section.deleteMany();
  await prisma.form.deleteMany();
  await prisma.athlete.deleteMany();
  await prisma.address.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.memberArea.deleteMany();
  await prisma.token.deleteMany();
  await prisma.member.deleteMany();
  await prisma.area.deleteMany();
}

export async function seedAreas() {
  const areaNames = [
    "UNSPECIFIED",
    "PSYCHOLOGY",
    "PHYSIOTHERAPY",
    "NUTRITION",
    "NURSING",
    "PSYCHOPEDAGOGY",
    "PHYSICAL_EDUCATION",
  ];

  await prisma.area.createMany({
    data: areaNames.map((name) => ({ name: name as Specialties })),
    skipDuplicates: true,
  });
}

export async function seedAnamnesisForm() {
  await prisma.form.create({
    data: {
      name: "Anamnese",
      slug: "anamnesis",
      sections: {
        create: [
          {
            title: "Informacoes do atleta",
            icon: "HeartHandshake",
            questions: {
              create: [
                {
                  title: "Local de nascimento",
                  type: "INPUT",
                },
              ],
            },
          },
        ],
      },
    },
  });
}
