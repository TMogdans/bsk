import { sql, createSqlTag } from 'slonik';
import { pool } from '../db/pool';
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
    types: z.array(z.object({
      id: z.number(),
      name: z.string()
    })),
    void: z.object({}).strict()
  },
});

export class TypeRepository {
  /**
   * Find all event types
   */
  async findAll(): Promise<Type[]> {
    logger.debug('Finding all event types');
    
    return (await pool).connect(async (connection) => {
      const result = await connection.query(sqlTypes.typeAlias('types')`
        SELECT id, name
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
    
    return (await pool).connect(async (connection) => {
      const result = await connection.maybeOne(sqlTypes.typeAlias('type')`
        SELECT id, name
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
    
    return (await pool).connect(async (connection) => {
      const result = await connection.maybeOne(sqlTypes.typeAlias('type')`
        SELECT id, name
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
    
    return (await pool).connect(async (connection) => {
      const result = await connection.one(sqlTypes.typeAlias('type')`
        INSERT INTO types (
          name
        ) 
        VALUES (
          ${data.name}
        )
        RETURNING id, name
      `);
      
      return result;
    });
  }

  /**
   * Update an existing event type
   */
  async update(id: number, data: UpdateType): Promise<Type | null> {
    logger.debug({ id, data }, 'Updating event type');
    
    return (await pool).connect(async (connection) => {
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
      
      const result = await connection.maybeOne(sqlTypes.typeAlias('type')`
        UPDATE types
        SET ${setClause}
        WHERE id = ${id}
        RETURNING id, name
      `);
      
      return result;
    });
  }

  /**
   * Delete an event type by ID
   */
  async delete(id: number): Promise<boolean> {
    logger.debug({ id }, 'Deleting event type');
    
    return (await pool).connect(async (connection) => {
      const result = await connection.query(sqlTypes.typeAlias('void')`
        DELETE FROM types
        WHERE id = ${id}
      `);
      
      return result.rowCount > 0;
    });
  }
}