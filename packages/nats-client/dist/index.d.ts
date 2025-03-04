import { type NatsConnection, type Subscription } from 'nats';
export declare class NatsClient {
    private connection;
    private codec;
    connect(server?: string): Promise<NatsConnection>;
    publish<T>(subject: string, data: T): Promise<void>;
    subscribe<T>(subject: string, callback: (data: T) => void): Promise<Subscription>;
    close(): Promise<void>;
}
declare const _default: NatsClient;
export default _default;
//# sourceMappingURL=index.d.ts.map