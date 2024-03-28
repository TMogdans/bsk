import baseProcessor from "./baseProcessor";
import { ProcessorInterface } from "./processorInterface";
import { BaseMessage, BoardgameMessage } from "../types/messages";
import { newBoardGameMessageSchema } from "../schemas/boardgameMessageSchema";
import Boardgame from "../entity/Boardgame";

export default class boardgameProcessor
  extends baseProcessor
  implements ProcessorInterface
{
  private message: BoardgameMessage | undefined = undefined;

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
      const boardgame = new Boardgame();

        boardgame.name = name;
        boardgame.description = description;
        boardgame.minAge = minAge;
        boardgame.minNumberOfPlayers = minNumberOfPlayers;
        boardgame.maxNumberOfPlayers = maxNumberOfPlayers;
        boardgame.minPlayTimeMinutes = minPlayTimeMinutes;
        boardgame.maxPlayTimeMinutes = maxPlayTimeMinutes;

        return await boardgame.save();
    } catch (e) {
      console.error(e);
      console.log("Failed to persist boardgame");
    }
  }
}
