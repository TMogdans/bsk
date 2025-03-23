import * as NATS from 'nats';
import { createLogger } from '../utils/logger';
import { config } from '../config';
import type { EventResponse } from '../schemas/eventSchema';
import { z } from 'zod';

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
   * Sendet eine Benachrichtigung über ein Event-Update
   */
  async publishEventUpdate(event: EventResponse, action: 'created' | 'updated' | 'deleted'): Promise<void> {
    if (!this.connected || !this.client) {
      await this.connect();
    }
    
    const notification: EventNotification = {
      eventId: event.id,
      name: event.name,
      slug: event.slug,
      action,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Veröffentliche die Nachricht im NATS
      const sc = NATS.StringCodec();
      this.client?.publish(
        'events.updates',
        sc.encode(JSON.stringify(notification))
      );
      
      logger.info({ eventId: event.id, action }, 'Published event notification');
    } catch (error) {
      logger.error({ error, event, action }, 'Failed to publish event notification');
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