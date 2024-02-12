import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const mq = await prisma.config.upsert({
    where: { name: "material_quality" },
    update: {},
    create: {
      name: "material_quality",
      weight: 0.7,
      order: 0,
    },
  });
  const layout = await prisma.config.upsert({
    where: { name: "layout" },
    update: {},
    create: {
      name: "layout",
      weight: 0.8,
      order: 1,
    },
  });
  const complexity = await prisma.config.upsert({
    where: { name: "complexity" },
    update: {},
    create: {
      name: "complexity",
      weight: 0.4,
      order: 2,
    },
  });
  const difficulty = await prisma.config.upsert({
    where: { name: "difficulty" },
    update: {},
    create: {
      name: "difficulty",
      weight: 0.5,
      order: 3,
    },
  });
  const fun = await prisma.config.upsert({
    where: { name: "fun" },
    update: {},
    create: {
      name: "fun",
      weight: 1,
      order: 4,
    },
  });
  const variety = await prisma.config.upsert({
    where: { name: "variety" },
    update: {},
    create: {
      name: "variety",
      weight: 0.6,
      order: 5,
    },
  });
  const replayability = await prisma.config.upsert({
    where: { name: "replayability" },
    update: {},
    create: {
      name: "replayability",
      weight: 0.8,
      order: 6,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
