import {MessageSubject} from "./service/observer/messageSubject";
import {IncomingMessageObserver} from "./service/observer/incomingMessageObserver";

const subject = new MessageSubject();
const incomingMessageObserver = new IncomingMessageObserver();

subject.attach(incomingMessageObserver);
subject.subscribeToMessageBus()
  .then(() => console.log("rating-read-service started"))
  .catch((err) => console.error(err));
