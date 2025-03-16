import {RatingMessage} from "../types/rating";
import {collect} from "collectionizejs";
import {Rating} from "../entity/Rating";
import {Config} from "../entity/Config";

export default class RatingGenerator {
    private receivedMessage: RatingMessage;
    private readonly config: Config[];
    private ratings = collect();
    private configMap = new Map<string, Config>();

    constructor(receivedMessage: RatingMessage, config: Config[]) {
        this.receivedMessage = receivedMessage;
        this.config = config;

        this.createConfigMap();
        this.processMessageForDB();
        this.processMessageForEvent();
    }

    private processMessageForDB() {
        const {objectId, userId} = this.extractObjectInformation();
        const {object_id, user_id, ...payload} = this.receivedMessage.payload;

        for (const [key, value] of Object.entries(payload)) {
            const result = this.configMap.get(key);
            if (result === undefined) {
                console.error(`Config not found for ${key}`);
                continue;
            }

            const rating = new Rating();

            rating.configId = result.id;
            rating.userId = userId;
            rating.objectId = objectId;
            rating.value = value;

            rating.save().then(r => console.log("Rating saved", r));


        }
    }

    private createConfigMap() {
        for (const c of this.config) {
            this.configMap.set(c.name, c);
        }
        console.log("Config map created", this.configMap);
    }

    private extractObjectInformation() {
        const objectId = this.receivedMessage.payload.object_id;
        const userId = this.receivedMessage.payload.user_id;

        return {objectId, userId};
    }

    private processMessageForEvent() {
        const {object_id, user_id, ...payload} = this.receivedMessage.payload;

        for (const [key, value] of Object.entries(payload)) {
            const result = this.configMap.get(key);
            if (result === undefined) {
                console.error(`Config not found for ${key}`);
                continue;
            }

            this.ratings.add({
                value,
                weight: result.weight,
                name: result.name,
            })
        }
    }

    public async getRatings() {
        return this.ratings;
    }
}
