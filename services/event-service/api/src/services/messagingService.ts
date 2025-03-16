import natsClient from '@bsk/nats-client';
import { createLogger } from '../utils/logger';
import { config } from '../config';
import { EventResponse } from '../schemas/eventSchema';
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
  
  /**
   * Initialisiert die Verbindung zu NATS
   */
  async connect(): Promise<void> {
    if (this.connected) return;
    
    try {
      await natsClient.connect(config.nats.url);
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
    if (!this.connected) {
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
      await natsClient.publish<EventNotification>('events.updates', notification);
      logger.info({ eventId: event.id, action }, 'Published event notification');
    } catch (error) {
      logger.error({ error, event, action }, 'Failed to publish event notification');
    }
  }
  
  /**
   * Schließt die Verbindung zu NATS
   */
  async close(): Promise<void> {
    if (this.connected) {
      await natsClient.close();
      this.connected = false;
      logger.info('Closed NATS connection');
    }
  }
}