import {MessageSubscriber} from "./messageSubscriber";
import {RatingsProcessor} from "../ratingsProcessor";

export class IncomingMessageObserver implements Observer {
    public update(subject: Subscriber) {
        if(subject instanceof MessageSubscriber) {
            const ratingsProcessor = new RatingsProcessor(subject);
            console.log(JSON.stringify(ratingsProcessor.getDataset()));
            // persist in db (update or insert)
        }
    }
}
