import { sql, SqlSqlToken } from 'slonik';
import { pool } from '../db/pool';
import { CreateEvent, Event, EventFilter, UpdateEvent } from '../schemas/eventSchema';
import { createLogger } from '../utils/logger';
import slugify from 'slugify';

const logger = createLogger('EventRepository');

export class EventRepository {
  /**
   * Find all published events that haven't ended yet
   */
  async findAllFuturePublished(filter?: EventFilter): Promise<Event[]> {
    logger.debug({ filter }, 'Finding all future published events');
    
    return pool.connect(async (connection) => {
      // Base query
      let query = sql`
        SELECT e.* 
        FROM events e
        JOIN types t ON e.type_id = t.id
        WHERE e.published = TRUE
        AND e.ends_at >= NOW()
        AND e.deleted_at IS NULL
      `;
      
      // Apply filters
      if (filter) {
        if (filter.presence === 'online') {
          query = sql`${query} AND e.online_event = TRUE`;
        } else if (filter.presence === 'offline') {
          query = sql`${query} AND e.online_event = FALSE`;
        }
        
        if (filter.barrierFree) {
          query = sql`${query} AND e.barrier_free = TRUE`;
        }
        
        if (filter.entryFree) {
          query = sql`${query} AND e.entry_free = TRUE`;
        }
        
        if (filter.type) {
          query = sql`${query} AND t.name = ${filter.type}`;
        }
      }
      
      // Sort by date
      query = sql`${query} ORDER BY e.begins_at ASC`;
      
      const result = await connection.query<Event>(query);
      return result.rows;
    });
  }

  /**
   * Find an event by its slug
   */
  async findBySlug(slug: string): Promise<Event | null> {
    logger.debug({ slug }, 'Finding event by slug');
    
    return pool.connect(async (connection) => {
      const result = await connection.maybeOne<Event>(sql`
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
    
    return pool.connect(async (connection) => {
      const result = await connection.maybeOne<Event>(sql`
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
    
    const slug = slugify(data.name, { lower: true, strict: true });
    
    return pool.connect(async (connection) => {
      const result = await connection.one<Event>(sql`
        INSERT INTO events (
          name, slug, type_id, begins_at, ends_at, zip, location, country, 
          street, description, barrier_free, entry_free, online_event, 
          published, event_url, created_by
        ) VALUES (
          ${data.name}, 
          ${slug}, 
          ${data.type_id}, 
          ${data.begins_at}, 
          ${data.ends_at}, 
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
    
    return pool.connect(async (connection) => {
      // Build dynamic SET part of the query
      const updates: SqlSqlToken[] = [];
      
      // Only include fields that are defined
      if (data.name !== undefined) {
        updates.push(sql`name = ${data.name}`);
        // Also update slug when name changes
        updates.push(sql`slug = ${slugify(data.name, { lower: true, strict: true })}`);
      }
      
      // Directly map other fields
      const fieldMappings: Array<[keyof UpdateEvent, string]> = [
        ['type_id', 'type_id'],
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
          updates.push(sql`${sql.identifier([column])} = ${data[key]}`);
        }
      }
      
      // Add updated_at timestamp
      updates.push(sql`updated_at = NOW()`);
      
      // If no updates, return early
      if (updates.length === 0) {
        return this.findById(id);
      }
      
      // Combine all the update fragments
      const setClause = sql.join(updates, sql`, `);
      
      const result = await connection.maybeOne<Event>(sql`
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
    
    return pool.connect(async (connection) => {
      const result = await connection.query(sql`
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
    
    return pool.connect(async (connection) => {
      const result = await connection.query(sql`
        DELETE FROM events
        WHERE id = ${id}
      `);
      
      return result.rowCount > 0;
    });
  }

  /**
   * Get event with type information for presentation
   */
  async getEventWithType(id: number | string): Promise<(Event & { type_name: string; type_translations: Record<string, string> }) | null> {
    logger.debug({ id }, 'Getting event with type information');
    
    const condition = typeof id === 'number' 
      ? sql`e.id = ${id}`
      : sql`e.slug = ${id}`;
    
    return pool.connect(async (connection) => {
      const result = await connection.maybeOne<Event & { type_name: string; type_translations: Record<string, string> }>(sql`
        SELECT e.*, t.name as type_name, t.translations as type_translations
        FROM events e
        JOIN types t ON e.type_id = t.id
        WHERE ${condition}
        AND e.deleted_at IS NULL
      `);
      
      return result;
    });
  }
}