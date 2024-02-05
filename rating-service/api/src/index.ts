import express, {Request, Response} from "express";
import {connect, JSONCodec} from "nats";

const app = express()
const port = process.env.PORT || 3000;
const natsServer = process.env.NATS_SERVER || "localhost:4222";
const nc = await connect({ servers: natsServer });
const jc = JSONCodec();
const subject = "ratings";

const sub = nc.subscribe(subject);
(async () => {
  for await (const m of sub) {
    const receivedMessage = JSON.stringify(jc.decode(m.data));

    console.log(`[${sub.getProcessed()}]: ${receivedMessage}`);
  }
  console.log("subscription closed");
})();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, rating-service! 123456')
})

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
})
