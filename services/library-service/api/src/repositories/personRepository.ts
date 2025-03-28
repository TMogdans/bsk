import { createLogger } from "../utils/logger";
import { getPool } from "../db/pool";
import { Person, personSchema } from "../schemas/personSchema";
import { createSqlTag } from "slonik";

const logger = createLogger("personRepository");

const sqlPersons = createSqlTag({
	typeAliases: {
		person: personSchema,
	},
});

export class PersonRepository {
		async create(data: Person) {
			logger.debug("Creating person");
			const pool = await getPool();
			const result = await pool.one(sqlPersons.typeAlias("person")`
            INSERT INTO persons (
                first_name,
                last_name,
                description,
                user_id,
                created_by
            ) VALUES (
                ${data.firstName},
                ${data.lastName},
                ${data.description},
                ${data.userId},
                ${data.created_by}
            ) RETURNING *
        `);
		
        return result;
	}

    async findAll() {
        logger.debug("Finding all persons");
        const pool = await getPool();
        const result = await pool.any(sqlPersons.typeAlias("person")`
            SELECT * FROM persons WHERE deleted_at IS NULL
        `);
        return result;
    }

    async findById(id: string) {
        logger.debug("Finding person by id with related board games");
        const pool = await getPool();
        
        const result = await pool.maybeOne(sqlPersons.typeAlias("person")`
            SELECT p.*,
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
                               'role', 'designer',
                               'created_at', bg.created_at,
                               'updated_at', bg.updated_at
                           )
                       ) FILTER (WHERE bg_designers.board_game_id IS NOT NULL),
                       '[]'::jsonb
                   ) AS designer_games,
                   COALESCE(
                       jsonb_agg(
                           DISTINCT jsonb_build_object(
                               'id', bg_artists.board_game_id,
                               'name', bg_artists_data.name,
                               'description', bg_artists_data.description,
                               'minNumberOfPlayers', bg_artists_data.min_number_of_players,
                               'maxNumberOfPlayers', bg_artists_data.max_number_of_players,
                               'minPlayTimeMinutes', bg_artists_data.min_play_time_minutes,
                               'maxPlayTimeMinutes', bg_artists_data.max_play_time_minutes,
                               'minAge', bg_artists_data.min_age,
                               'role', 'artist',
                               'created_at', bg_artists_data.created_at,
                               'updated_at', bg_artists_data.updated_at
                           )
                       ) FILTER (WHERE bg_artists.board_game_id IS NOT NULL),
                       '[]'::jsonb
                   ) AS artist_games
            FROM persons p
            LEFT JOIN board_games_designers bg_designers ON p.id = bg_designers.person_id
            LEFT JOIN board_games bg ON bg_designers.board_game_id = bg.id AND bg.deleted_at IS NULL
            
            LEFT JOIN board_games_artists bg_artists ON p.id = bg_artists.person_id
            LEFT JOIN board_games bg_artists_data ON bg_artists.board_game_id = bg_artists_data.id AND bg_artists_data.deleted_at IS NULL
            
            WHERE p.id = ${id} AND p.deleted_at IS NULL
            GROUP BY p.id
        `);
        
        return result;
    }

    async findSoftDeleted() {
        logger.debug("Finding soft deleted persons");
        const pool = await getPool();
        const result = await pool.any(sqlPersons.typeAlias("person")`
            SELECT * FROM persons WHERE deleted_at IS NOT NULL
        `);
        return result;
    }

    async update(id: string, data: Partial<Person>) {
        logger.debug("Updating person");
        const pool = await getPool();
        const result = await pool.one(sqlPersons.typeAlias("person")`
            UPDATE persons SET
                first_name = ${data.firstName},
                last_name = ${data.lastName},
                description = ${data.description},
                user_id = ${data.userId},
                updated_at = NOW()
            WHERE id = ${id} RETURNING *
        `);
        return result;
    }

    async softDelete(id: string) {
        logger.debug("Soft deleting person");
        const pool = await getPool();
        const result = await pool.one(sqlPersons.typeAlias("person")`
            UPDATE persons SET
                deleted_at = NOW()
            WHERE id = ${id} RETURNING *
        `);
        return result;
    }

    async hardDelete(id: string) {
        logger.debug("Hard deleting person");
        const pool = await getPool();
        const result = await pool.one(sqlPersons.typeAlias("person")`
            DELETE FROM persons WHERE id = ${id}
        `);
        return result;
    }

    async restore(id: string) {
        logger.debug("Restoring person");
        const pool = await getPool();
        const result = await pool.one(sqlPersons.typeAlias("person")`
            UPDATE persons SET
                deleted_at = NULL
            WHERE id = ${id} RETURNING *
        `);
        return result;
    }
};