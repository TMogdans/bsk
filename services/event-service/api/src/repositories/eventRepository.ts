import { createSqlTag, sql, type SqlToken } from 'slonik';
import { pool } from '../db/pool';
import { 
  CreateEvent, 
  createEventSchema, 
  eventResponseSchema, 
  type Event, 
  type EventFilter, 
  type UpdateEvent 
} from '../schemas/eventSchema';
import { createLogger } from '../utils/logger';
import slugify from "slugify";;
import { eventSchema } from '../schemas/eventSchema';
import { z } from 'zod';

const logger = createLogger('EventRepository');
const sqlEvents = createSqlTag({
  typeAliases: {
    event: eventSchema,
    events: z.array(eventSchema),
    eventResponse: eventResponseSchema,
    void: z.object({}).strict()
  },
});

export class EventRepository {
  /**
   * Find all published events that haven't ended yet
   */
  async findAllFuturePublished(filter?: EventFilter): Promise<readonly Event[]> {
    logger.debug({ filter }, 'Finding all future published events');
    
    return (await pool).connect(async (connection) => {
      let query = sql.fragment`
        SELECT e.* 
        FROM events e
        JOIN types t ON e.type_id = t.id
        WHERE e.published = TRUE
        AND e.ends_at >= NOW()
        AND e.deleted_at IS NULL
      `;

        // Apply filters
        if (filter) {
          if (filter.presence === "online") {
            query = sql.fragment`${query} AND e.online_event = TRUE`;
          } else if (filter.presence === "offline") {
            query = sql.fragment`${query} AND e.online_event = FALSE`;
          }

          if (filter.barrierFree) {
            query = sql.fragment`${query} AND e.barrier_free = TRUE`;
          }

          if (filter.entryFree) {
            query = sql.fragment`${query} AND e.entry_free = TRUE`;
          }

          if (filter.type) {
            query = sql.fragment`${query} AND t.name = ${filter.type}`;
          }
        }

        const result = await connection.query(sqlEvents.typeAlias("events")`${query} ORDER BY e.begins_at ASC`);
        return result.rows as unknown as Event[];
      });
  }

  /**
   * Find an event by its slug
   */
  async findBySlug(slug: string): Promise<Event | null> {
    logger.debug({ slug }, 'Finding event by slug');
    
    return (await pool).connect(async (connection) => {
      const result = await connection.maybeOne(sqlEvents.typeAlias("event")`
        SELECT e.* 
        FROM events e
        WHERE e.slug = ${slug}
        AND e.published = TRUE
        AND e.ends_at >= NOW()
        AND e.deleted_at IS NULL
      `);
      
      return result;
    });
  }

  /**
   * Find an event by its ID
   */
  async findById(id: number): Promise<Event | null> {
    logger.debug({ id }, 'Finding event by ID');
    
    return (await pool).connect(async (connection) => {
      const result = await connection.maybeOne(sqlEvents.typeAlias("event")`
        SELECT * 
        FROM events
        WHERE id = ${id}
        AND deleted_at IS NULL
      `);
      
      return result;
    });
  }

  /**
   * Create a new event
   */
  async create(data: Omit<Event, 'id' | 'slug' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<Event> {
    logger.debug({ data }, 'Creating new event');
    
    const slug = slugify(data.name);
    
    return (await pool).connect(async (connection) => {
      const result = await connection.one(sqlEvents.typeAlias("event")`
        INSERT INTO events (
          name, slug, type_id, begins_at, ends_at, zip, location, country, 
          street, description, barrier_free, entry_free, online_event, 
          published, event_url, created_by
        ) VALUES (
          ${data.name}, 
          ${slug}, 
          ${data.type_id}, 
          ${sql.timestamp(data.begins_at)}, 
          ${sql.timestamp(data.ends_at)},  
          ${data.zip || null}, 
          ${data.location || null}, 
          ${data.country}, 
          ${data.street || null}, 
          ${data.description}, 
          ${data.barrier_free}, 
          ${data.entry_free}, 
          ${data.online_event}, 
          ${data.published || false}, 
          ${data.event_url}, 
          ${data.created_by}
        )
        RETURNING *
      `);
      
      return result;
    });
  }

  /**
   * Update an existing event
   */
  async update(id: number, data: UpdateEvent): Promise<Event | null> {
    logger.debug({ id, data }, 'Updating event');
    
    return (await pool).connect(async (connection) => {
      // Build dynamic SET part of the query
      const updates: SqlToken[] = [];
      
      // Only include fields that are defined
      if (data.name !== undefined) {
        updates.push(sql.fragment`name = ${data.name}`);
        // Also update slug when name changes
        updates.push(sql.fragment`slug = ${slugify(data.name)}`);
      }
      
      // Directly map other fields
      const fieldMappings: Array<[keyof UpdateEvent, string]> = [
        ['type', 'type_id'],
        ['begins_at', 'begins_at'],
        ['ends_at', 'ends_at'],
        ['zip', 'zip'],
        ['location', 'location'],
        ['country', 'country'],
        ['street', 'street'],
        ['description', 'description'],
        ['barrier_free', 'barrier_free'],
        ['entry_free', 'entry_free'],
        ['online_event', 'online_event'],
        ['published', 'published'],
        ['event_url', 'event_url']
      ];
      
      for (const [key, column] of fieldMappings) {
        if (data[key] !== undefined) {
          const value = data[key] instanceof Date 
            ? sql.timestamp(data[key] as Date)  
            : data[key];
          updates.push(sql.fragment`${sql.identifier([column])} = ${value}`);
        }
      }
      
      // Add updated_at timestamp
      updates.push(sql.fragment`updated_at = NOW()`);
      
      // If no updates, return early
      if (updates.length === 0) {
        return this.findById(id);
      }
      
      // Combine all the update fragments
      const setClause = sql.join(updates, sql.fragment`,`);
      
      const result = await connection.maybeOne(sqlEvents.typeAlias("event")`
        UPDATE events
        SET ${setClause}
        WHERE id = ${id}
        AND deleted_at IS NULL
        RETURNING *
      `);
      
      return result;
    });
  }

  /**
   * Soft delete an event by setting deleted_at
   */
  async softDelete(id: number): Promise<boolean> {
    logger.debug({ id }, 'Soft deleting event');
    
    return (await pool).connect(async (connection) => {
      const result = await connection.query(sqlEvents.typeAlias('void')`
        UPDATE events
        SET deleted_at = NOW()
        WHERE id = ${id}
        AND deleted_at IS NULL
      `);
      
      return result.rowCount > 0;
    });
  }

  /**
   * Hard delete an event (usually only for testing/admin purposes)
   */
  async hardDelete(id: number): Promise<boolean> {
    logger.debug({ id }, 'Hard deleting event');
    
    return (await pool).connect(async (connection) => {
      const result = await connection.query(sqlEvents.typeAlias('void')`
        DELETE FROM events
        WHERE id = ${id}
      `);
      
      return result.rowCount > 0;
    });
  }

  /**
   * Get event with type information for presentation
   */
  async getEventWithType(id: number | string): Promise<(Event & { type_name: string }) | null> {
    logger.debug({ id }, 'Getting event with type information');
    
    const condition = typeof id === 'number' 
      ? sql.fragment`e.id = ${id}`
      : sql.fragment`e.slug = ${id}`;
    
    return (await pool).connect(async (connection) => {
      const result = await connection.maybeOne(sqlEvents.typeAlias("eventResponse")`
        SELECT e.*, t.name as type_name
        FROM events e
        JOIN types t ON e.type_id = t.id
        WHERE ${condition}
        AND e.deleted_at IS NULL
      `);
      
      return result as (Event & { type_name: string }) | null;
    });
  }
}