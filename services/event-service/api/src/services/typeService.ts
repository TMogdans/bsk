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
  
  async getAllTypes(): Promise<Array<{ id: number; name: string; }>> {
    logger.debug('Getting all event types');
    
    const types = await this.typeRepository.findAll();
    
    return types.map(type => ({
      id: type.id,
      name: type.name
    }));
  }
  
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
  
  async createType(data: CreateType): Promise<{ id: number; name: string; }> {
    logger.debug({ data }, 'Creating new type');
    
    const type = await this.typeRepository.create(data);
    
    return {
      id: type.id,
      name: type.name
    };
  }
  
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
  
  async deleteType(id: number): Promise<void> {
    logger.debug({ id }, 'Deleting type');
    
    const deleted = await this.typeRepository.delete(id);
    
    if (!deleted) {
      throw new NotFoundError(`Type with ID ${id} not found`);
    }
  }
}