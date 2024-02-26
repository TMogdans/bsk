import {MessageSubject} from "./messageSubject";
import {RatingsProcessor} from "../ratingsProcessor";

export class IncomingMessageObserver implements Observer {
    public update(subject: Subscriber) {
        if(subject instanceof MessageSubject) {
            const ratingsProcessor = new RatingsProcessor(subject.objectId, subject.ratingsCollection);
            console.log(ratingsProcessor.getDatasets().toJson());
            // persist in db (update or insert)
        }
    }
}
