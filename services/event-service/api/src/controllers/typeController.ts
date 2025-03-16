import { Request, Response, NextFunction } from 'express';
import { TypeService } from '../services/typeService';
import { createTypeSchema, updateTypeSchema } from '../schemas/eventSchema';
import { createLogger } from '../utils/logger';
import { ValidationError } from '../middleware/errorHandler';

const logger = createLogger('TypeController');

export class TypeController {
  private typeService: TypeService;
  
  constructor() {
    this.typeService = new TypeService();
  }
  
  /**
   * Get all event types
   */
  async getAllTypes(req: Request, res: Response, next: NextFunction) {
    try {
      logger.debug('Getting all types');
      
      const types = await this.typeService.getAllTypes();
      
      return res.json(types);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get a specific type by ID
   */
  async getTypeById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      logger.debug({ id }, 'Getting type by ID');
      
      if (isNaN(id)) {
        throw new ValidationError('Invalid ID format', { id: 'Must be a number' });
      }
      
      const type = await this.typeService.getTypeById(id);
      
      return res.json(type);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Create a new event type
   */
  async createType(req: Request, res: Response, next: NextFunction) {
    try {
      logger.debug({ body: req.body }, 'Creating new type');
      
      // Validate request body
      const validationResult = createTypeSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        throw new ValidationError('Invalid type data', validationResult.error.format());
      }
      
      const type = await this.typeService.createType(validationResult.data);
      
      return res.status(201).json(type);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update an existing event type
   */
  async updateType(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      logger.debug({ id, body: req.body }, 'Updating type');
      
      if (isNaN(id)) {
        throw new ValidationError('Invalid ID format', { id: 'Must be a number' });
      }
      
      // Validate request body
      const validationResult = updateTypeSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        throw new ValidationError('Invalid type data', validationResult.error.format());
      }
      
      const type = await this.typeService.updateType(id, validationResult.data);
      
      return res.json(type);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete an event type
   */
  async deleteType(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      logger.debug({ id }, 'Deleting type');
      
      if (isNaN(id)) {
        throw new ValidationError('Invalid ID format', { id: 'Must be a number' });
      }
      
      await this.typeService.deleteType(id);
      
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}