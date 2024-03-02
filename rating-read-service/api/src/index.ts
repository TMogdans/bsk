import {MessageSubscriber} from "./service/observer/messageSubscriber";
import {IncomingMessageObserver} from "./service/observer/incomingMessageObserver";

const messageSubscriber = new MessageSubscriber();
const incomingMessageObserver = new IncomingMessageObserver();

messageSubscriber.attach(incomingMessageObserver);
messageSubscriber.subscribeToMessageBus()
  .then(() => console.log("rating-read-service started"))
  .catch((err) => console.error(err));
