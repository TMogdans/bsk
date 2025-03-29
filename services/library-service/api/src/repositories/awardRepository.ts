import { Award, awardSchema } from "../schemas/awardSchema";
import { getPool } from "../db/pool";
import { createLogger } from "../utils/logger";
import { createSqlTag } from "slonik";
import { slugify } from "../utils/slugify";

const logger = createLogger("AwardRepository");
const sqlAwards = createSqlTag({
		typeAliases: {
			award: awardSchema,
		},
	});

export class AwardRepository {
    async create(data: Omit<Award, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
        logger.debug("Creating award");
        const pool = await getPool();
        
        const slug = slugify(data.name);

        const result = await pool.one(sqlAwards.typeAlias("award")`
           INSERT INTO awards (
                name, slug, description, created_by
            ) VALUES (
                ${data.name},
                ${slug},
                ${data.description},
                ${data.created_by}
            ) RETURNING *
        `);
        return result;

    }

    async findAll() {
        logger.debug("Finding all awards");
        const pool = await getPool();
        const result = await pool.any(sqlAwards.typeAlias("award")`
            SELECT * FROM awards WHERE deleted_at IS NULL
        `);
        return result;
    }

    async findById(id: string) {
        logger.debug("Finding award by id with related board games");
        const pool = await getPool();
        
        const result = await pool.one(sqlAwards.typeAlias("award")`
            SELECT a.*,
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
            FROM awards a
            LEFT JOIN board_games_awards bga ON a.id = bga.award_id
            LEFT JOIN board_games bg ON bga.board_game_id = bg.id AND bg.deleted_at IS NULL
            WHERE a.id = ${id} AND a.deleted_at IS NULL
            GROUP BY a.id
        `);
        
        return result;
    }

    async findSoftDeleted() {
        logger.debug("Finding soft deleted awards");
        const pool = await getPool();
        const result = await pool.any(sqlAwards.typeAlias("award")` SELECT * FROM awards WHERE deleted_at IS NOT NULL`);
        return result;
    }
    
    async update(id: string, data: Partial<Omit<Award, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>) {
        logger.debug("Updating award");
        const pool = await getPool();
        const slug = slugify(data.name || "");
        const result = await pool.one(sqlAwards.typeAlias("award")`
            UPDATE awards SET
                name = ${data.name},
                slug = ${slug},
                description = ${data.description},
                updated_at = NOW()
            WHERE id = ${id} AND deleted_at IS NULL RETURNING *
        `);
        return result;
    }

    async softDelete(id: string) {
        logger.debug("Soft deleting award");
        const pool = await getPool();
        const result = await pool.one(sqlAwards.typeAlias("award")`
            UPDATE awards SET
                deleted_at = NOW()
            WHERE id = ${id} RETURNING *
        `);
        return result;
    }

    async hardDelete(id: string) {
        logger.debug("Hard deleting award");
        const pool = await getPool();
        const result = await pool.one(sqlAwards.typeAlias("award")`
            DELETE FROM awards WHERE id = ${id} RETURNING *
        `);
        return result;
    }

    async restore(id: string) {
        logger.debug("Restoring award");
        const pool = await getPool();
        const result = await pool.one(sqlAwards.typeAlias("award")`
            UPDATE awards SET
                deleted_at = NULL
            WHERE id = ${id} RETURNING *
        `);
        return result;
    }
};