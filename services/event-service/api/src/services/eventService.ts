import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { TypeRepository } from '../repositories/typeRepository';
import { EventRepository } from '../repositories/eventRepository';
import { CreateEvent, EventFilter, UpdateEvent } from '../schemas/eventSchema';
import { EventList, Month } from '../types/eventTypes';
import { createLogger } from '../utils/logger';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler';
import { MessagingService } from './messagingService';

const logger = createLogger('EventService');

export class EventService {
  private typeRepository: TypeRepository;
  private eventRepository: EventRepository;
  private messagingService: MessagingService;
  
  constructor() {
    this.typeRepository = new TypeRepository();
    this.eventRepository = new EventRepository();
    this.messagingService = new MessagingService();
  }
  
  /**
   * Get all future published events, grouped by month
   */
  async getAllFuturePublishedEvents(filter?: EventFilter): Promise<EventList> {
    logger.debug({ filter }, 'Getting all future published events');
    
    const events = await this.eventRepository.findAllFuturePublished(filter);
    
    if (events.length === 0) {
      return {
        heading: `Termine ${new Date().getFullYear()}`,
        months: []
      };
    }
    
    // Load events with type information
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const eventWithType = await this.eventRepository.getEventWithType(event.id);
        if (!eventWithType) {
          return null;
        }
        
        // Format for API response
        return {
          ...eventWithType,
          type: {
            name: eventWithType.type_name,
            translated: this.getTranslation(eventWithType.type_translations, 'de')
          },
          meta: {
            url: `/events/${eventWithType.slug}`
          }
        };
      })
    );
    
    // Filter out any nulls
    const validEvents = enrichedEvents.filter(Boolean);
    
    // Group by month and format for API response
    const months = this.groupEventsByMonth(validEvents);
    
    return {
      heading: `Termine ${new Date().getFullYear()}`,
      months
    };
  }
  
  /**
   * Get a specific event by its slug
   */
  async getEventBySlug(slug: string) {
    logger.debug({ slug }, 'Getting event by slug');
    
    const event = await this.eventRepository.getEventWithType(slug);
    
    if (!event) {
      throw new NotFoundError(`No event found with slug: ${slug}`);
    }
    
    // Format for API response
    return {
      ...event,
      type: {
        name: event.type_name,
        translated: this.getTranslation(event.type_translations, 'de')
      },
      meta: {
        url: `/events/${event.slug}`
      }
    };
  }
  
  /**
   * Create a new event
   */
  async createEvent(eventData: CreateEvent): Promise<any> {
    logger.debug({ eventData }, 'Creating new event');
    
    // Convert type string to type_id
    const type = await this.typeRepository.findByName(eventData.type);
    
    if (!type) {
      throw new BadRequestError(`Type '${eventData.type}' not found`);
    }
    
    // Create event with type_id
    const newEvent = await this.eventRepository.create({
      ...eventData,
      type_id: type.id
    });
    
    // Get full event with type information
    const createdEvent = await this.eventRepository.getEventWithType(newEvent.id);
    
    if (!createdEvent) {
      throw new Error('Failed to retrieve created event');
    }
    
    // Format for API response
    const formattedEvent = {
      ...createdEvent,
      type: {
        name: createdEvent.type_name,
        translated: this.getTranslation(createdEvent.type_translations, 'de')
      },
      meta: {
        url: `/events/${createdEvent.slug}`
      }
    };
    
    // Publish event creation notification
    try {
      await this.messagingService.publishEventUpdate(formattedEvent, 'created');
    } catch (error) {
      logger.error({ error }, 'Failed to publish event creation notification');
      // Don't throw - we still want to return the created event even if messaging fails
    }
    
    return formattedEvent;
  }
  
  /**
   * Update an existing event
   */
  async updateEvent(id: number, eventData: UpdateEvent): Promise<any> {
    logger.debug({ id, eventData }, 'Updating event');
    
    // Check if event exists
    const existingEvent = await this.eventRepository.findById(id);
    
    if (!existingEvent) {
      throw new NotFoundError(`Event with ID ${id} not found`);
    }
    
    // If type is provided, convert to type_id
    let type_id = undefined;
    
    if (eventData.type) {
      const type = await this.typeRepository.findByName(eventData.type);
      
      if (!type) {
        throw new BadRequestError(`Type '${eventData.type}' not found`);
      }
      
      type_id = type.id;
    }
    
    // Update event
    const updatedEvent = await this.eventRepository.update(id, {
      ...eventData,
      type_id
    });
    
    if (!updatedEvent) {
      throw new Error('Failed to update event');
    }
    
    // Get full event with type information
    const eventWithType = await this.eventRepository.getEventWithType(updatedEvent.id);
    
    if (!eventWithType) {
      throw new Error('Failed to retrieve updated event');
    }
    
    // Format for API response
    const formattedEvent = {
      ...eventWithType,
      type: {
        name: eventWithType.type_name,
        translated: this.getTranslation(eventWithType.type_translations, 'de')
      },
      meta: {
        url: `/events/${eventWithType.slug}`
      }
    };
    
    // Publish event update notification
    try {
      await this.messagingService.publishEventUpdate(formattedEvent, 'updated');
    } catch (error) {
      logger.error({ error }, 'Failed to publish event update notification');
    }
    
    return formattedEvent;
  }
  
  /**
   * Delete an event
   */
  async deleteEvent(id: number): Promise<void> {
    logger.debug({ id }, 'Deleting event');
    
    // Get event before deletion for notification
    const event = await this.eventRepository.getEventWithType(id);
    
    if (!event) {
      throw new NotFoundError(`Event with ID ${id} not found`);
    }
    
    const deleted = await this.eventRepository.softDelete(id);
    
    if (!deleted) {
      throw new NotFoundError(`Event with ID ${id} not found`);
    }
    
    // Format for notification
    const formattedEvent = {
      ...event,
      type: {
        name: event.type_name,
        translated: this.getTranslation(event.type_translations, 'de')
      },
      meta: {
        url: `/events/${event.slug}`
      }
    };
    
    // Publish event deletion notification
    try {
      await this.messagingService.publishEventUpdate(formattedEvent, 'deleted');
    } catch (error) {
      logger.error({ error }, 'Failed to publish event deletion notification');
    }
  }
  
  /**
   * Group events by month
   */
  private groupEventsByMonth(events: any[]): Month[] {
    if (events.length === 0) {
      return [];
    }
    
    const eventsByMonth: Record<string, any[]> = {};
    
    // Group events by month
    for (const event of events) {
      const date = new Date(event.begins_at);
      const monthYear = format(date, 'MMMM yyyy', { locale: de });
      
      if (!eventsByMonth[monthYear]) {
        eventsByMonth[monthYear] = [];
      }
      
      eventsByMonth[monthYear].push(event);
    }
    
    // Convert to array of Month objects
    return Object.entries(eventsByMonth).map(([heading, events]) => ({
      heading,
      events
    }));
  }
  
  /**
   * Get translation for a specific language
   */
  private getTranslation(translations: Record<string, string> | null, lang: string): string {
    if (!translations) {
      return '';
    }
    
    return translations[lang] || Object.values(translations)[0] || '';
  }
}