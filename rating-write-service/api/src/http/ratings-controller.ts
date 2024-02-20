import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRatingsForBoardGameId = async (boardGameId: string) => {
  return prisma.rating.findMany({
    select: {
      userId: true,
      objectId: true,
      value: true,
      createdAt: true,
      config: {
        select: {
          name: true,
          weight: true,
        }
      }
    },
    where: {
      objectId: boardGameId,
    },
  });
};
