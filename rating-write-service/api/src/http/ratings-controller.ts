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

export const getRatingsForBoardGameIdAndUserId = async (boardGameId: string, userId: string) => {
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
        userId: userId,
        },
    });
}

export const getAllRatings = async () => {
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
    }
  });
};
