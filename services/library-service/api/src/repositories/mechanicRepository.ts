import { getPool } from "../db/pool";
import { Mechanic, mechanicSchema } from "../schemas/mechanicSchema";
import { createLogger } from "../utils/logger";
import { createSqlTag } from "slonik";

const logger = createLogger("mechanicRepository");

const sqlMechanics = createSqlTag({
    typeAliases: {
        mechanic: mechanicSchema,
    },
});

export class MechanicRepository {
    async create(data: Omit<Mechanic, "id" | "created_at" | "updated_at" | "deleted_at">) {
        logger.debug("Creating mechanic");
        const pool = await getPool();
        const result = await pool.one(sqlMechanics.typeAlias("mechanic")`
            INSERT INTO mechanics (name, description, created_by)
            VALUES (${data.name}, ${data.description}, ${data.created_by})
            RETURNING *
        `);
        return result;
    }

    async findAll() {
        logger.debug("Finding all mechanics");
        const pool = await getPool();
        const result = await pool.any(sqlMechanics.typeAlias("mechanic")`
            SELECT * FROM mechanics WHERE deleted_at IS NULL
        `);
        return result;
    }

    async findById(id: string) {
        logger.debug("Finding mechanic by id with related board games");
        const pool = await getPool();
        
        const result = await pool.maybeOne(sqlMechanics.typeAlias("mechanic")`
            SELECT m.*,
                   COALESCE(
                       jsonb_agg(
                           DISTINCT jsonb_build_object(
                               'id', bg.id,
                               'name', bg.name,
                               'description', bg.description,
                               'minNumberOfPlayers', bg.min_number_of_players,
                               'maxNumberOfPlayers', bg.max_number_of_players,
                               'minPlayTimeMinutes', bg.min_play_time_minutes,
                               'maxPlayTimeMinutes', bg.max_play_time_minutes,
                               'minAge', bg.min_age,
                               'created_at', bg.created_at,
                               'updated_at', bg.updated_at
                           )
                       ) FILTER (WHERE bg.id IS NOT NULL),
                       '[]'::jsonb
                   ) AS board_games
            FROM mechanics m
            LEFT JOIN board_games_mechanics bgm ON m.id = bgm.mechanic_id
            LEFT JOIN board_games bg ON bgm.board_game_id = bg.id AND bg.deleted_at IS NULL
            WHERE m.id = ${id} AND m.deleted_at IS NULL
            GROUP BY m.id
        `);
        
        return result;
    }

    async findSoftDeleted() {
        logger.debug("Finding soft deleted mechanics");
        const pool = await getPool();
        const result = await pool.any(sqlMechanics.typeAlias("mechanic")`
            SELECT * FROM mechanics WHERE deleted_at IS NOT NULL
        `);
        return result;
    }

    async update(id: string, data: Partial<Mechanic>) {
        logger.debug("Updating mechanic");
        const pool = await getPool();
        const result = await pool.one(sqlMechanics.typeAlias("mechanic")`
            UPDATE mechanics SET
                name = COALESCE(${data.name}, name),
                description = COALESCE(${data.description}, description),
                updated_at = NOW()
            WHERE id = ${id} AND deleted_at IS NULL
            RETURNING *
        `);
        return result;
    }

    async softDelete(id: string) {
        logger.debug("Soft deleting mechanic");
        const pool = await getPool();
        const result = await pool.one(sqlMechanics.typeAlias("mechanic")`
            UPDATE mechanics SET
                deleted_at = NOW()
            WHERE id = ${id} AND deleted_at IS NULL
            RETURNING *
        `);
        return result;
    }

    async hardDelete(id: string) {
        logger.debug("Hard deleting mechanic");
        const pool = await getPool();
        const result = await pool.query(sqlMechanics.typeAlias("mechanic")`
            DELETE FROM mechanics WHERE id = ${id}
        `);
        return result;
    }

    async restore(id: string) {
        logger.debug("Restoring mechanic");
        const pool = await getPool();
        const result = await pool.one(sqlMechanics.typeAlias("mechanic")`
            UPDATE mechanics SET
                deleted_at = NULL
            WHERE id = ${id}
            RETURNING *
        `);
        return result;
    }
}