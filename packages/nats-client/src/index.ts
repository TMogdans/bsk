import { connect, type NatsConnection, JSONCodec, type Subscription } from 'nats';

export class NatsClient {
  private connection: NatsConnection | null = null;
  private codec = JSONCodec();

  async connect(server: string = process.env.NATS_SERVER || 'localhost:4222'): Promise<NatsConnection> {
    if (!this.connection) {
      this.connection = await connect({ servers: server });
      console.log(`Connected to NATS at ${server}`);
    }
    return this.connection;
  }

  async publish<T>(subject: string, data: T): Promise<void> {
    if (!this.connection) {
      throw new Error('Not connected to NATS');
    }
    this.connection.publish(subject, this.codec.encode(data));
  }

  async subscribe<T>(subject: string, callback: (data: T) => void): Promise<Subscription> {
    if (!this.connection) {
      throw new Error('Not connected to NATS');
    }
    
    const subscription = this.connection.subscribe(subject);
    
    (async () => {
      for await (const msg of subscription) {
        const data = this.codec.decode(msg.data) as unknown as T;
        callback(data);
      }
    })().catch(err => console.error('Subscription error:', err));
    
    return subscription;
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }
}

export default new NatsClient();