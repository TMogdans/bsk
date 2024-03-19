import baseProcessor from "./baseProcessor";
import { ProcessorInterface } from "./processorInterface";
import { BaseMessage, BoardgameMessage } from "../types/messages";
import { PrismaClient, Prisma } from "@prisma/client";
import { newBoardGameMessageSchema } from "../schemas/boardgameMessageSchema";

export default class boardgameProcessor
  extends baseProcessor
  implements ProcessorInterface
{
  private message: BoardgameMessage | undefined = undefined;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public setMessage(message: BaseMessage) {
    this.validate(message, newBoardGameMessageSchema)
      .then(() => (this.message = message as BoardgameMessage))
      .catch((e) => console.log(e));

    return this;
  }

  public async create() {
    if (this.message === undefined) {
      throw new Error("Message not set");
    }

    const {
      name,
      description,
      maxPlayTimeMinutes,
      minPlayTimeMinutes,
      minAge,
      minNumberOfPlayers,
      maxNumberOfPlayers,
    } = this.message.payload;

    try {
      return await this.dbClient.boardGame.create({
        data: {
          name,
          description,
          minPlayTimeMinutes,
          maxPlayTimeMinutes,
          minNumberOfPlayers,
          maxNumberOfPlayers,
          minAge
        } as Prisma.BoardGameCreateInput
      })
    } catch (e) {
      console.error(e);
      console.log("Failed to persist boardgame");
    }
  }
}
