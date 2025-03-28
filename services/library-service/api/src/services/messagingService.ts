import * as NATS from 'nats';
import { createLogger } from '../utils/logger';
import { config } from '../config';
import { z } from 'zod';
import { AwardMessage } from '../schemas/awardSchema';

const logger = createLogger('MessagingService');

// Schema für Event-Benachrichtigungen
export const eventNotificationSchema = z.object({
  eventId: z.number(),
  name: z.string(),
  slug: z.string(),
  action: z.enum(['created', 'updated', 'deleted']),
  timestamp: z.string().datetime()
});

export type EventNotification = z.infer<typeof eventNotificationSchema>;

export class MessagingService {
  private connected = false;
  private client?: NATS.NatsConnection;
  
  /**
   * Initialisiert die Verbindung zu NATS
   */
  async connect(): Promise<void> {
    if (this.connected) return;
    
    try {
      this.client = await NATS.connect({ servers: config.nats.url });
      this.connected = true;
      logger.info(`Connected to NATS server at ${config.nats.url}`);
    } catch (error) {
      logger.error({ error }, 'Failed to connect to NATS server');
      throw new Error('Failed to connect to NATS server');
    }
  }
    
  /**
   * Schließt die Verbindung zu NATS
   */
  async close(): Promise<void> {
    if (this.connected && this.client) {
      await this.client.drain();
      this.connected = false;
      logger.info('Closed NATS connection');
    }
  }
}