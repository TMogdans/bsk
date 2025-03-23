import { TypeRepository } from '../repositories/typeRepository';
import { CreateType, Type, UpdateType } from '../schemas/eventSchema';
import { createLogger } from '../utils/logger';
import { NotFoundError } from '../middleware/errorHandler';

const logger = createLogger('TypeService');

export class TypeService {
  private typeRepository: TypeRepository;
  
  constructor() {
    this.typeRepository = new TypeRepository();
  }
  
  /**
   * Get all event types
   */
  async getAllTypes(): Promise<Array<{ id: number; name: string; }>> {
    logger.debug('Getting all event types');
    
    const types = await this.typeRepository.findAll();
    
    // Format types for API response
    return types.map(type => ({
      id: type.id,
      name: type.name
    }));
  }
  
  /**
   * Get a specific type by ID
   */
  async getTypeById(id: number): Promise<{ id: number; name: string; }> {
    logger.debug({ id }, 'Getting type by ID');
    
    const type = await this.typeRepository.findById(id);
    
    if (!type) {
      throw new NotFoundError(`Type with ID ${id} not found`);
    }
    
    return {
      id: type.id,
      name: type.name
    };
  }
  
  /**
   * Create a new event type
   */
  async createType(data: CreateType): Promise<{ id: number; name: string; }> {
    logger.debug({ data }, 'Creating new type');
    
    const type = await this.typeRepository.create(data);
    
    return {
      id: type.id,
      name: type.name
    };
  }
  
  /**
   * Update an existing event type
   */
  async updateType(id: number, data: UpdateType): Promise<{ id: number; name: string; }> {
    logger.debug({ id, data }, 'Updating type');
    
    const type = await this.typeRepository.update(id, data);
    
    if (!type) {
      throw new NotFoundError(`Type with ID ${id} not found`);
    }
    
    return {
      id: type.id,
      name: type.name
    };
  }
  
  /**
   * Delete an event type
   */
  async deleteType(id: number): Promise<void> {
    logger.debug({ id }, 'Deleting type');
    
    const deleted = await this.typeRepository.delete(id);
    
    if (!deleted) {
      throw new NotFoundError(`Type with ID ${id} not found`);
    }
  }
}