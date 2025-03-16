import {connect, Msg, NatsConnection, NatsError} from "nats.ws";
import {useEffect, useState} from "react";

export const natsClientPromise = connect({servers: 'nats://localhost:4222'});

export function useNats() {
    const [nats, setNats] = useState<NatsConnection | null>(null);

    useEffect(() => {
        if (!nats) {
            natsClientPromise.then((nc) => {
                setNats(nc)
            }).catch((err) => console.error('connect failed', err));
        }
    }, []);

    return nats;
}

type SuccessCallback = (msg: Msg) => Promise<void>;

export function useNatsSubscription(subject: string, onMessage: SuccessCallback) {
    const nc = useNats();

    useEffect(() => {
        if (!nc) return;
        const sub = nc.subscribe(subject, {
            callback: function (err: NatsError | null, msg: Msg) {
                if (err) {
                    console.error('Error:', err);
                } else {
                    onMessage(msg)
                }
            }
        });
        return () => {
            sub.unsubscribe()
        }
    }, [nc])
}