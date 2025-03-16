import React from "react"
import {useNatsSubscription} from "../hooks/useNats";
import {JSONCodec, Msg} from "nats.ws";

const natsSubject = 'commands';
const sc = JSONCodec();

type Props = {
    id: string;
}

export const Hello = ({id}: Props) => {
    const [data, setData] = React.useState<RatingReadMessage | null>(null);
    // const nc = useNats();
    useNatsSubscription(natsSubject, onMessage);

    async function onMessage(msg: Msg) {
        const data = sc.decode(msg.data) as BaseMessage;
        if (data.message === 'rating-read') {
            setData(data as RatingReadMessage);
        }
    }

    // async function sendMessage() {
    //     nc!.publish(natsSubject, sc.encode({id: id}));
    // }

    return (<>
            <div>Hallo vong Remote</div>
            <p>Test: {id}</p>
            <p>Received: {data ? data.payload.total : 'no data'}</p>
        </>
    );
}