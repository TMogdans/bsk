import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/eventService';
import { createEventSchema, filterSchema, updateEventSchema } from '../schemas/eventSchema';
import { createLogger } from '../utils/logger';
import { ValidationError } from '../middleware/errorHandler';

const logger = createLogger('EventController');

export class EventController {
  private eventService: EventService;
  
  constructor() {
    this.eventService = new EventService();
  }
  
  /**
   * Get all future published events
   */
  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      logger.debug({ query: req.query }, 'Getting all events');
      
      // Validate and parse query parameters
      const filterResult = filterSchema.safeParse(req.query);
      
      if (!filterResult.success) {
        throw new ValidationError('Invalid filter parameters', filterResult.error.format());
      }
      
      const events = await this.eventService.getAllFuturePublishedEvents(
        filterResult.success ? filterResult.data : undefined
      );
      
      return res.json(events);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get a specific event by slug
   */
  async getEventBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      logger.debug({ slug }, 'Getting event by slug');
      
      const event = await this.eventService.getEventBySlug(slug);
      
      return res.json(event);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Create a new event
   */
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      logger.debug({ body: req.body }, 'Creating new event');
      
      // Validate request body
      const validationResult = createEventSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        throw new ValidationError('Invalid event data', validationResult.error.format());
      }
      
      const event = await this.eventService.createEvent(validationResult.data);
      
      return res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update an existing event
   */
  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      logger.debug({ id, body: req.body }, 'Updating event');
      
      if (isNaN(id)) {
        throw new ValidationError('Invalid ID format', { id: 'Must be a number' });
      }
      
      // Validate request body
      const validationResult = updateEventSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        throw new ValidationError('Invalid event data', validationResult.error.format());
      }
      
      const event = await this.eventService.updateEvent(id, validationResult.data);
      
      return res.json(event);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete an event
   */
  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      logger.debug({ id }, 'Deleting event');
      
      if (isNaN(id)) {
        throw new ValidationError('Invalid ID format', { id: 'Must be a number' });
      }
      
      await this.eventService.deleteEvent(id);
      
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}