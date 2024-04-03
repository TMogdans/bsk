import baseProcessor from "./baseProcessor";
import { ProcessorInterface } from "./processorInterface";
import { BaseMessage, BoardgameMessage } from "../types/messages";
import { newBoardGameMessageSchema } from "../schemas/boardgameMessageSchema";
import Boardgame from "../entity/Boardgame";
import { Award } from "../entity/Award";
import { In } from "typeorm";
import { Category } from "../entity/Category";
import { Mechanic } from "../entity/Mechanic";
import { Publisher } from "../entity/Publisher";
import { Person } from "../entity/Person";
import { Link } from "../entity/Link";

export default class BoardgameProcessor
  extends baseProcessor
  implements ProcessorInterface
{
  private message: BoardgameMessage | undefined = undefined;

  public async setMessage(message: BaseMessage) {
    await this.validate(message, newBoardGameMessageSchema)
      .then(() => (this.message = message as BoardgameMessage))
      .catch((e) => console.log(e));
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
      awards,
      categories,
      mechanics,
      publishers,
      designers,
      artists,
      links,
    } = this.message.payload;

    return Promise.allSettled([
      Award.findBy({ slug: In(awards) }),
      Category.findBy({ slug: In(categories) }),
      Mechanic.findBy({ slug: In(mechanics) }),
      Publisher.findBy({ slug: In(publishers) }),
      Person.findBy({ slug: In(designers) }),
      Person.findBy({ slug: In(artists) }),
      Link.findBy({ name: In(links) }),
    ]).then((values) => {
      const awards = values[0].status === "fulfilled" ? values[0] as PromiseFulfilledResult<Award[]> : { value: [] as Award[] };
      const categories = values[1].status === "fulfilled" ? values[1] as PromiseFulfilledResult<Category[]> : { value: [] as Category[] };
      const mechanics = values[2].status === "fulfilled" ? values[2] as PromiseFulfilledResult<Mechanic[]> : { value: [] as Mechanic[] };
      const publishers = values[3].status === "fulfilled" ? values[3] as PromiseFulfilledResult<Publisher[]> : { value: [] as Publisher[] };
      const designers = values[4].status === "fulfilled" ? values[4] as PromiseFulfilledResult<Person[]> : { value: [] as Person[] };
      const artists = values[5].status === "fulfilled" ? values[5] as PromiseFulfilledResult<Person[]> : { value: [] as Person[] }
      const links = values[6].status === "fulfilled" ? values[6] as PromiseFulfilledResult<Link[]> : { value: [] as Link[] };

      try {
        const boardgame = new Boardgame();

        boardgame.name = name;
        boardgame.slug = name.toLowerCase().replace(/ /g, "-");
        boardgame.description = description;
        boardgame.minAge = minAge;
        boardgame.minNumberOfPlayers = minNumberOfPlayers;
        boardgame.maxNumberOfPlayers = maxNumberOfPlayers;
        boardgame.minPlayTimeMinutes = minPlayTimeMinutes;
        boardgame.maxPlayTimeMinutes = maxPlayTimeMinutes;
        boardgame.awards = awards.value;
        boardgame.categories = categories.value;
        boardgame.mechanics = mechanics.value;
        boardgame.publishers = publishers.value;
        boardgame.designers = designers.value;
        boardgame.artists = artists.value;
        boardgame.links = links.value;

        return boardgame.save();
      } catch (e) {
        console.log("Failed to persist boardgame: ", e);
      }
    });
  }
}
