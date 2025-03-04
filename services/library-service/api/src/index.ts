import { subscriber } from "./pubsub/subscriber";
import "reflect-metadata"
import {AppDataSource} from "./data-source";

console.log("Hallo, ich bin der BoardGame-Service");

AppDataSource.initialize()
    .then(() => {
        subscriber()
            .then(() => console.log("started"))
            .catch((e) => {
                console.error(e);
            });
    })
    .catch((e) => {
        console.error(e);
    });
