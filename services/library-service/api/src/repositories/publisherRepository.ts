import { getPool } from "../db/pool";
import { createLogger } from "../utils/logger";
import { Publisher, publisherSchema } from "../schemas/publisherSchema";
import { createSqlTag } from "slonik";

const logger = createLogger("PublisherRepository");
const sqlPublishers = createSqlTag({
		typeAliases: {
			publisher: publisherSchema,
		},
	});

export class PublisherRepository {
    async create(data: Omit<Publisher, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
        logger.debug("Creating publisher");
        const pool = await getPool();
        const result = await pool.one(sqlPublishers.typeAlias("publisher")`
           INSERT INTO publishers (
                name, slug, description, created_by
            ) VALUES (
                ${data.name},
                ${data.description},
                ${data.created_by}
            ) RETURNING *
        `);
        return result;
    }

    async findAll() {
        logger.debug("Finding all publishers");
        const pool = await getPool();
        const result = await pool.any(sqlPublishers.typeAlias("publisher")`
            SELECT * FROM publishers WHERE deleted_at IS NULL
        `);
        return result;
    }

    async findById(id: string) {
        logger.debug("Finding publisher by id with related board games");
        const pool = await getPool();
        
        const result = await pool.maybeOne(sqlPublishers.typeAlias("publisher")`
            SELECT p.*,
                   COALESCE(
                       jsonb_agg(
                           DISTINCT jsonb_build_object(
                               'id', bg.id,
                               'name', bg.name,
                               'description', bg.description,
                               'min_number_of_players', bg.min_number_of_players,
                               'max_number_of_players', bg.max_number_of_players,
                               'min_play_time_minutes', bg.min_play_time_minutes,
                               'max_play_time_minutes', bg.max_play_time_minutes,
                               'min_age', bg.min_age,
                               'year_published', bg.year_published,
                               'created_at', bg.created_at,
                               'updated_at', bg.updated_at
                           )
                       ) FILTER (WHERE bg.id IS NOT NULL),
                       '[]'::jsonb
                   ) AS board_games
            FROM publishers p
            LEFT JOIN board_games_publishers bgp ON p.id = bgp.publisher_id
            LEFT JOIN board_games bg ON bgp.board_game_id = bg.id AND bg.deleted_at IS NULL
            WHERE p.id = ${id} AND p.deleted_at IS NULL
            GROUP BY p.id
        `);
        
        return result;
    }

    async findSoftDeleted() {
        logger.debug("Finding soft deleted publishers");
        const pool = await getPool();
        const result = await pool.any(sqlPublishers.typeAlias("publisher")`
            SELECT * FROM publishers WHERE deleted_at IS NOT NULL
        `);
        return result;
    }

    async update(id: string, data: Partial<Publisher>) {
        logger.debug("Updating publisher");
        const pool = await getPool();
        const result = await pool.one(sqlPublishers.typeAlias("publisher")`
            UPDATE publishers SET
                name = ${data.name},
                description = ${data.description},
                updated_at = NOW()
            WHERE id = ${id} AND deleted_at IS NULL
            RETURNING *
        `);
        return result;
    }

    async softDelete(id: string) {
        logger.debug("Soft deleting publisher");
        const pool = await getPool();
        const result = await pool.one(sqlPublishers.typeAlias("publisher")`
            UPDATE publishers SET
                deleted_at = NOW()
            WHERE id = ${id} AND deleted_at IS NULL
            RETURNING *
        `);
        return result;
    }

    async hardDelete(id: string) {
        logger.debug("Hard deleting publisher");
        const pool = await getPool();
        const result = await pool.query(sqlPublishers.typeAlias("publisher")`           
            DELETE FROM publishers WHERE id = ${id}
        `);
        return result;
    }

    async restore(id: string) {
        logger.debug("Restoring publisher");
        const pool = await getPool();
        const result = await pool.one(sqlPublishers.typeAlias("publisher")`
            UPDATE publishers SET
                deleted_at = NULL
            WHERE id = ${id}
            RETURNING *
        `);
        return result;
    }
}