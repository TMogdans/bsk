"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsClient = void 0;
const nats_1 = require("nats");
class NatsClient {
    constructor() {
        this.connection = null;
        this.codec = (0, nats_1.JSONCodec)();
    }
    async connect(server = process.env.NATS_SERVER || 'localhost:4222') {
        if (!this.connection) {
            this.connection = await (0, nats_1.connect)({ servers: server });
            console.log(`Connected to NATS at ${server}`);
        }
        return this.connection;
    }
    async publish(subject, data) {
        if (!this.connection) {
            throw new Error('Not connected to NATS');
        }
        this.connection.publish(subject, this.codec.encode(data));
    }
    async subscribe(subject, callback) {
        if (!this.connection) {
            throw new Error('Not connected to NATS');
        }
        const subscription = this.connection.subscribe(subject);
        (async () => {
            for await (const msg of subscription) {
                const data = this.codec.decode(msg.data);
                callback(data);
            }
        })().catch(err => console.error('Subscription error:', err));
        return subscription;
    }
    async close() {
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
        }
    }
}
exports.NatsClient = NatsClient;
exports.default = new NatsClient();
//# sourceMappingURL=index.js.map