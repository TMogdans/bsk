import {connect, JSONCodec} from "nats";
import {RatingCreatedMessage} from "../../types/messages";
import {ratingCreatedSchema} from "../../schemas/ratingCreatedSchema";
import {collect} from "collectionizejs";

export class MessageSubscriber implements Subscriber {
    public ratingsCollection = collect([]);
    public objectId = "";
    public userId = "";

    private natsServer = process.env.NATS_SERVER || "nats://localhost:4222";
    private observers: Observer[] = [];

    public attach(observer: Observer) {
        const isExist = this.observers.includes(observer);
        if(isExist) {
            return console.log('Subject: Observer has been attached already.');
        }

        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    public detach(observer: Observer) {
        const observerIndex = this.observers.indexOf(observer);
        if(observerIndex === -1) {
            return console.log('Subject: Nonexistent observer.');
        }

        this.observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }

    public notify() {
        console.log('Subject: Notifying observers...');
        for(const observer of this.observers) {
            observer.update(this);
        }
    }

    public async subscribeToMessageBus() {
        const nc = await connect({servers: this.natsServer});
        const codec = JSONCodec();
        const subject = "events";
        const sub = nc.subscribe(subject);

        for await (const m of sub) {
            let receivedMessage = undefined as unknown;

            try {
                receivedMessage = codec.decode(m.data);
            } catch (e) {
                console.error(e);
                continue;
            }

            let validatedMessage = {} as RatingCreatedMessage;

            try {
                validatedMessage = await this.getValidatedMessage(receivedMessage);
            } catch (e) {
                console.error(e);
                continue;
            }

            console.info(
                `[${sub.getProcessed()}]: ${JSON.stringify(validatedMessage.payload)}`,
            );

            this.objectId = validatedMessage.payload.object_id;
            this.userId = validatedMessage.payload.user_id;
            this.ratingsCollection = collect(validatedMessage.payload.ratings);

            this.notify();
        }
        console.log("subscription closed");
    }

    private async getValidatedMessage(receivedMessage: unknown) {
        await ratingCreatedSchema.validate(receivedMessage);

        const validatedRatingCreatedMessage =
            receivedMessage as unknown as RatingCreatedMessage;

        if (
            validatedRatingCreatedMessage.message !== "rating-created" ||
            validatedRatingCreatedMessage.meta.version !== "1.0.0"
        ) {
            throw new Error("Invalid message");
        }

        return validatedRatingCreatedMessage;
    }
}
