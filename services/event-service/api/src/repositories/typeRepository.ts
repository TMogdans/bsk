import { sql, createSqlTag } from 'slonik';
import  {getPool}  from '../db/pool';
import type { CreateType, Type, UpdateType } from '../schemas/eventSchema';
import { createLogger } from '../utils/logger';
import { z } from 'zod';

const logger = createLogger('TypeRepository');

// Erstelle einen typisierten SQL-Tag für bessere Typsicherheit
const sqlTypes = createSqlTag({
  typeAliases: {
    type: z.object({
      id: z.number(),
      name: z.string()
    }),
    types: z.object({
      id: z.number(),
      name: z.string()
    }),
    void: z.object({}).strict()
  },
});

export class TypeRepository {
  /**
   * Find all event types
   */
  async findAll(): Promise<ReadonlyArray<Type>> {
    logger.debug('Finding all event types');
    const pool = await getPool();
    
      return await pool.many(sqlTypes.typeAlias('types')`
        SELECT id, name
        FROM types
        ORDER BY name ASC
      `);
  }

  /**
   * Find a type by its name
   */
  async findByName(name: string) {
    logger.debug({ name }, 'Finding event type by name');
    const pool = await getPool();

      const result = await pool.maybeOne(sqlTypes.typeAlias('type')`
        SELECT id, name
        FROM types 
        WHERE name = ${name}
      `);
      
      return result;
  }

  /**
   * Find a type by its ID
   */
  async findById(id: number) {
    logger.debug({ id }, 'Finding event type by ID');
    const pool = await getPool();
    
      const result = await pool.maybeOne(sqlTypes.typeAlias('type')`
        SELECT id, name
        FROM types 
        WHERE id = ${id}
      `);
      
      return result;
  }

  /**
   * Create a new event type
   */
  async create(data: CreateType) {
    logger.debug({ data }, 'Creating new event type');
    const pool = await getPool();
    
      const result = await pool.one(sqlTypes.typeAlias('type')`
        INSERT INTO types (
          name
        ) 
        VALUES (
          ${data.name}
        )
        RETURNING id, name
      `);
      
      return result;
  }

  /**
   * Update an existing event type
   */
  async update(id: number, data: UpdateType) {
    logger.debug({ id, data }, 'Updating event type');
    const pool = await getPool();
    
      // Build dynamic SET part of the query
      const updates = [];
      
      if (data.name !== undefined) {
        updates.push(sql.fragment`name = ${data.name}`);
      }
      
      // If no updates, return early
      if (updates.length === 0) {
        return this.findById(id);
      }
      
      // Combine all the update fragments
      const setClause = sql.join(updates, sql.fragment`, `);
      
      const result = await pool.maybeOne(sqlTypes.typeAlias('type')`
        UPDATE types
        SET ${setClause}
        WHERE id = ${id}
        RETURNING id, name
      `);
      
      return result;
  }

  /**
   * Delete an event type by ID
   */
  async delete(id: number) {
    logger.debug({ id }, 'Deleting event type');
    const pool = await getPool();
    
      const result = await pool.query(sqlTypes.typeAlias('void')`
        DELETE FROM types
        WHERE id = ${id}
      `);
      
      return result.rowCount > 0;
  }
}