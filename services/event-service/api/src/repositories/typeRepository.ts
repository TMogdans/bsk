import { sql } from 'slonik';
import { pool } from '../db/pool';
import { CreateType, Type, UpdateType } from '../schemas/eventSchema';
import { createLogger } from '../utils/logger';

const logger = createLogger('TypeRepository');

export class TypeRepository {
  /**
   * Find all event types
   */
  async findAll(): Promise<Type[]> {
    logger.debug('Finding all event types');
    
    return pool.connect(async (connection) => {
      const result = await connection.query<Type>(sql`
        SELECT id, name, translations 
        FROM types
        ORDER BY name ASC
      `);
      
      return result.rows;
    });
  }

  /**
   * Find a type by its name
   */
  async findByName(name: string): Promise<Type | null> {
    logger.debug({ name }, 'Finding event type by name');
    
    return pool.connect(async (connection) => {
      const result = await connection.maybeOne<Type>(sql`
        SELECT id, name, translations 
        FROM types 
        WHERE name = ${name}
      `);
      
      return result;
    });
  }

  /**
   * Find a type by its ID
   */
  async findById(id: number): Promise<Type | null> {
    logger.debug({ id }, 'Finding event type by ID');
    
    return pool.connect(async (connection) => {
      const result = await connection.maybeOne<Type>(sql`
        SELECT id, name, translations 
        FROM types 
        WHERE id = ${id}
      `);
      
      return result;
    });
  }

  /**
   * Create a new event type
   */
  async create(data: CreateType): Promise<Type> {
    logger.debug({ data }, 'Creating new event type');
    
    return pool.connect(async (connection) => {
      const result = await connection.one<Type>(sql`
        INSERT INTO types (
          name, 
          translations
        ) 
        VALUES (
          ${data.name}, 
          ${data.translations ? JSON.stringify(data.translations) : null}
        )
        RETURNING id, name, translations
      `);
      
      return result;
    });
  }

  /**
   * Update an existing event type
   */
  async update(id: number, data: UpdateType): Promise<Type | null> {
    logger.debug({ id, data }, 'Updating event type');
    
    return pool.connect(async (connection) => {
      // Build dynamic SET part of the query
      const updates = [];
      
      if (data.name !== undefined) {
        updates.push(sql`name = ${data.name}`);
      }
      
      if (data.translations !== undefined) {
        updates.push(sql`translations = ${JSON.stringify(data.translations)}`);
      }
      
      // If no updates, return early
      if (updates.length === 0) {
        return this.findById(id);
      }
      
      // Combine all the update fragments
      const setClause = sql.join(updates, sql`, `);
      
      const result = await connection.maybeOne<Type>(sql`
        UPDATE types
        SET ${setClause}
        WHERE id = ${id}
        RETURNING id, name, translations
      `);
      
      return result;
    });
  }

  /**
   * Delete an event type by ID
   */
  async delete(id: number): Promise<boolean> {
    logger.debug({ id }, 'Deleting event type');
    
    return pool.connect(async (connection) => {
      const result = await connection.query(sql`
        DELETE FROM types
        WHERE id = ${id}
      `);
      
      return result.rowCount > 0;
    });
  }
}