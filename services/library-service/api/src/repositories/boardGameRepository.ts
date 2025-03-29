import { getPool } from "../db/pool";
import { BoardGame, boardGameSchema } from "../schemas/boardGameSchema";
import { createLogger } from "../utils/logger";
import { slugify } from "../utils/slugify";
import { createSqlTag } from "slonik";
import { z } from "zod";

const logger = createLogger("boardGameRepository");
const sqlBoardgames = createSqlTag({
    typeAliases: {
        boardgame: boardGameSchema,
        void: z.void()
    }
})

export class BoardGameRepository {
    async create(data: Omit<BoardGame, "id" | "createdAt" | "updatedAt" | "deletedAt">) {
        logger.debug("Creating board game");
        const pool = await getPool();
        
        // Erstelle einen Slug aus dem Namen
        const slug = slugify(data.name);
        
        const result = await pool.one(sqlBoardgames.typeAlias("boardgame")`
            INSERT INTO board_games (
                name, 
                slug,
                description, 
                min_age, 
                min_number_of_players, 
                max_number_of_players, 
                min_play_time_minutes, 
                max_play_time_minutes,
                created_at, 
                updated_at,
                created_by
            )
            VALUES (
                ${data.name}, 
                ${slug},
                ${data.description}, 
                ${data.minAge}, 
                ${data.minNumberOfPlayers}, 
                ${data.maxNumberOfPlayers}, 
                ${data.minPlayTimeMinutes}, 
                ${data.maxPlayTimeMinutes},
                NOW(), 
                NOW(),
                ${data.created_by}
            )
            RETURNING *
        `);

        // Relationen separat speichern, falls vorhanden
        if (data.awards && Array.isArray(data.awards) && data.awards.length > 0) {
            // Wir behandeln sowohl ID-Arrays als auch Objekt-Arrays
            const awardIds = data.awards.map(award => typeof award === 'string' ? award : award.id);
            await this.updateAwards(result.id, awardIds);
        }
        
        if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
            const categoryIds = data.categories.map(category => typeof category === 'string' ? category : category.id);
            await this.updateCategories(result.id, categoryIds);
        }
        
        if (data.mechanics && Array.isArray(data.mechanics) && data.mechanics.length > 0) {
            const mechanicIds = data.mechanics.map(mechanic => typeof mechanic === 'string' ? mechanic : mechanic.id);
            await this.updateMechanics(result.id, mechanicIds);
        }
        
        if (data.publishers && Array.isArray(data.publishers) && data.publishers.length > 0) {
            const publisherIds = data.publishers.map(publisher => typeof publisher === 'string' ? publisher : publisher.id);
            await this.updatePublishers(result.id, publisherIds);
        }
        
        if (data.designers && Array.isArray(data.designers) && data.designers.length > 0) {
            const designerIds = data.designers.map(designer => typeof designer === 'string' ? designer : designer.id);
            await this.updateDesigners(result.id, designerIds);
        }
        
        if (data.artists && Array.isArray(data.artists) && data.artists.length > 0) {
            const artistIds = data.artists.map(artist => typeof artist === 'string' ? artist : artist.id);
            await this.updateArtists(result.id, artistIds);
        }
        
        if (data.links && Array.isArray(data.links) && data.links.length > 0) {
            const linkIds = data.links.map(link => typeof link === 'string' ? link : link.id);
            await this.updateLinks(result.id, linkIds);
        }
        
        return result;
    }

    async findAll() {
        logger.debug("Finding all board games");
        const pool = await getPool();
        const result = await pool.any(sqlBoardgames.typeAlias("boardgame")`
            SELECT * FROM board_games WHERE deleted_at IS NULL
        `);
        return result;
    }

    async findById(id: string) {
        logger.debug("Finding board game by id with all relations");
        const pool = await getPool();
        
        const result = await pool.maybeOne(sqlBoardgames.typeAlias("boardgame")`
            SELECT 
                bg.*,
                
                -- Awards
                COALESCE(
                    jsonb_agg(
                        DISTINCT jsonb_build_object(
                            'id', a.id,
                            'name', a.name,
                            'description', a.description,
                            'created_at', a.created_at,
                            'updated_at', a.updated_at
                        )
                    ) FILTER (WHERE a.id IS NOT NULL),
                    '[]'::jsonb
                ) AS awards_data,
                
                -- Categories
                COALESCE(
                    jsonb_agg(
                        DISTINCT jsonb_build_object(
                            'id', c.id,
                            'name', c.name,
                            'description', c.description,
                            'created_at', c.created_at,
                            'updated_at', c.updated_at
                        )
                    ) FILTER (WHERE c.id IS NOT NULL),
                    '[]'::jsonb
                ) AS categories_data,
                
                -- Mechanics
                COALESCE(
                    jsonb_agg(
                        DISTINCT jsonb_build_object(
                            'id', m.id,
                            'name', m.name,
                            'description', m.description,
                            'created_at', m.created_at,
                            'updated_at', m.updated_at
                        )
                    ) FILTER (WHERE m.id IS NOT NULL),
                    '[]'::jsonb
                ) AS mechanics_data,
                
                -- Publishers
                COALESCE(
                    jsonb_agg(
                        DISTINCT jsonb_build_object(
                            'id', p.id,
                            'name', p.name,
                            'description', p.description,
                            'created_at', p.created_at,
                            'updated_at', p.updated_at
                        )
                    ) FILTER (WHERE p.id IS NOT NULL),
                    '[]'::jsonb
                ) AS publishers_data,
                
                -- Designers (Persons)
                COALESCE(
                    jsonb_agg(
                        DISTINCT jsonb_build_object(
                            'id', d.id,
                            'firstName', d.first_name,
                            'lastName', d.last_name,
                            'description', d.description,
                            'created_at', d.created_at,
                            'updated_at', d.updated_at,
                            'role', 'designer'
                        )
                    ) FILTER (WHERE d.id IS NOT NULL),
                    '[]'::jsonb
                ) AS designers_data,
                
                -- Artists (Persons)
                COALESCE(
                    jsonb_agg(
                        DISTINCT jsonb_build_object(
                            'id', art.id,
                            'firstName', art.first_name,
                            'lastName', art.last_name,
                            'description', art.description,
                            'created_at', art.created_at,
                            'updated_at', art.updated_at,
                            'role', 'artist'
                        )
                    ) FILTER (WHERE art.id IS NOT NULL),
                    '[]'::jsonb
                ) AS artists_data,
                
                -- Links
                COALESCE(
                    jsonb_agg(
                        DISTINCT jsonb_build_object(
                            'id', l.id,
                            'url', l.url,
                            'title', l.title,
                            'description', l.description,
                            'created_at', l.created_at,
                            'updated_at', l.updated_at
                        )
                    ) FILTER (WHERE l.id IS NOT NULL),
                    '[]'::jsonb
                ) AS links_data
                
            FROM board_games bg
            
            -- Join Awards
            LEFT JOIN board_games_awards bga ON bg.id = bga.board_game_id
            LEFT JOIN awards a ON bga.award_id = a.id AND a.deleted_at IS NULL
            
            -- Join Categories
            LEFT JOIN board_games_categories bgc ON bg.id = bgc.board_game_id
            LEFT JOIN categories c ON bgc.category_id = c.id AND c.deleted_at IS NULL
            
            -- Join Mechanics
            LEFT JOIN board_games_mechanics bgm ON bg.id = bgm.board_game_id
            LEFT JOIN mechanics m ON bgm.mechanic_id = m.id AND m.deleted_at IS NULL
            
            -- Join Publishers
            LEFT JOIN board_games_publishers bgp ON bg.id = bgp.board_game_id
            LEFT JOIN publishers p ON bgp.publisher_id = p.id AND p.deleted_at IS NULL
            
            -- Join Designers
            LEFT JOIN board_games_designers bgd ON bg.id = bgd.board_game_id
            LEFT JOIN persons d ON bgd.person_id = d.id AND d.deleted_at IS NULL
            
            -- Join Artists
            LEFT JOIN board_games_artists bgart ON bg.id = bgart.board_game_id
            LEFT JOIN persons art ON bgart.person_id = art.id AND art.deleted_at IS NULL
            
            -- Join Links
            LEFT JOIN board_games_links bgl ON bg.id = bgl.board_game_id
            LEFT JOIN links l ON bgl.link_id = l.id AND l.deleted_at IS NULL
            
            WHERE bg.id = ${id} AND bg.deleted_at IS NULL
            GROUP BY bg.id
        `);
        
        if (result) {
            // Transformiere die Daten in das erwartete Format
            const transformed = {
                ...result,
                // Konvertiere Strings in das richtige Format (falls nötig)
                minAge: result.minAge,
                minNumberOfPlayers: result.minNumberOfPlayers,
                maxNumberOfPlayers: result.maxNumberOfPlayers,
                minPlayTimeMinutes: result.minPlayTimeMinutes,
                maxPlayTimeMinutes: result.maxPlayTimeMinutes,
                // Setze die detaillierten Daten für alle Beziehungen
                awards: result.awards,
                categories: result.categories,
                mechanics: result.mechanics,
                publishers: result.publishers,
                designers: result.designers,
                artists: result.artists,
                links: result.links
            };
            
            // Entferne die temporären Datenfelder und snake_case Felder, die wir in camelCase umgewandelt haben
            transformed.awards = undefined;
            transformed.categories = undefined;
            transformed.mechanics = undefined;
            transformed.publishers = undefined;
            transformed.designers = undefined;
            transformed.artists = undefined;
            transformed.links = undefined;
            transformed.minAge = undefined;
            transformed.minNumberOfPlayers = undefined;
            transformed.maxNumberOfPlayers = undefined;
            transformed.minPlayTimeMinutes = undefined;
            transformed.maxPlayTimeMinutes = undefined;
            
            return transformed;
        }
        
        return result;
    }

    async findSoftDeleted() {
        logger.debug("Finding soft deleted board games");
        const pool = await getPool();
        const result = await pool.any(sqlBoardgames.typeAlias("boardgame")`
            SELECT * FROM board_games WHERE deleted_at IS NOT NULL
        `);
        return result;
    }

    async update(id: string, data: Partial<BoardGame>) {
        logger.debug("Updating board game");
        const pool = await getPool();
        
        // Wenn ein neuer Name vorhanden ist, aktualisiere auch den Slug
        let slug = undefined;
        if (data.name) {
            slug = slugify(data.name);
        }
        
        const result = await pool.one(sqlBoardgames.typeAlias("boardgame")`
            UPDATE board_games 
            SET
                name = COALESCE(${data.name}, name),
                slug = COALESCE(${slug}, slug),
                description = COALESCE(${data.description}, description),
                min_age = COALESCE(${data.minAge}, min_age),
                min_number_of_players = COALESCE(${data.minNumberOfPlayers}, min_number_of_players),
                max_number_of_players = COALESCE(${data.maxNumberOfPlayers}, max_number_of_players),
                min_play_time_minutes = COALESCE(${data.minPlayTimeMinutes}, min_play_time_minutes),
                max_play_time_minutes = COALESCE(${data.maxPlayTimeMinutes}, max_play_time_minutes),
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
        `);
        
        // Aktualisiere die Beziehungen, wenn sie im Datenpaket vorhanden sind
        if (data.awards !== undefined) {
            const awardIds = Array.isArray(data.awards) 
                ? data.awards.map(award => typeof award === 'string' ? award : award.id)
                : [];
            await this.updateAwards(result.id, awardIds);
        }
        
        if (data.categories !== undefined) {
            const categoryIds = Array.isArray(data.categories) 
                ? data.categories.map(category => typeof category === 'string' ? category : category.id)
                : [];
            await this.updateCategories(result.id, categoryIds);
        }
        
        if (data.mechanics !== undefined) {
            const mechanicIds = Array.isArray(data.mechanics) 
                ? data.mechanics.map(mechanic => typeof mechanic === 'string' ? mechanic : mechanic.id)
                : [];
            await this.updateMechanics(result.id, mechanicIds);
        }
        
        if (data.publishers !== undefined) {
            const publisherIds = Array.isArray(data.publishers) 
                ? data.publishers.map(publisher => typeof publisher === 'string' ? publisher : publisher.id)
                : [];
            await this.updatePublishers(result.id, publisherIds);
        }
        
        if (data.designers !== undefined) {
            const designerIds = Array.isArray(data.designers) 
                ? data.designers.map(designer => typeof designer === 'string' ? designer : designer.id)
                : [];
            await this.updateDesigners(result.id, designerIds);
        }
        
        if (data.artists !== undefined) {
            const artistIds = Array.isArray(data.artists) 
                ? data.artists.map(artist => typeof artist === 'string' ? artist : artist.id)
                : [];
            await this.updateArtists(result.id, artistIds);
        }
        
        if (data.links !== undefined) {
            const linkIds = Array.isArray(data.links) 
                ? data.links.map(link => typeof link === 'string' ? link : link.id)
                : [];
            await this.updateLinks(result.id, linkIds);
        }
        
        return result;
    }

    async softDelete(id: string) {
        logger.debug("Soft deleting board game");
        const pool = await getPool();
        const result = await pool.one(sqlBoardgames.typeAlias("boardgame")`
            UPDATE board_games
            SET deleted_at = NOW()
            WHERE id = ${id}
            RETURNING *
        `);
        return result;
    }

    async hardDelete(id: string) {
        logger.debug("Hard deleting board game");
        const pool = await getPool();
        const result = await pool.one(sqlBoardgames.typeAlias("boardgame")`
            DELETE FROM board_games
            WHERE id = ${id}
            RETURNING *
        `);
        return result;
    }

    async restore(id: string) {
        logger.debug("Restoring board game");
        const pool = await getPool();
        const result = await pool.one(sqlBoardgames.typeAlias("boardgame")`
            UPDATE board_games
            SET deleted_at = NULL
            WHERE id = ${id}
            RETURNING *
        `);
        return result;
    }

    private async updateAwards(boardGameId: string, awardIds: string[]) {
        const pool = await getPool();
        // Vorhandene Einträge löschen
        await pool.query(sqlBoardgames.typeAlias("boardgame")`
            DELETE FROM board_games_awards WHERE board_game_id = ${boardGameId}
        `);
        
        // Neue Einträge hinzufügen
        for (const awardId of awardIds) {
            await pool.query(sqlBoardgames.typeAlias("boardgame")`
                INSERT INTO board_games_awards (board_game_id, award_id)
                VALUES (${boardGameId}, ${awardId})
            `);
        }
    }
    
    private async updateCategories(boardGameId: string, categoryIds: string[]) {
        const pool = await getPool();
        await pool.query(sqlBoardgames.typeAlias("boardgame")`
            DELETE FROM board_games_categories WHERE board_game_id = ${boardGameId}
        `);
        
        for (const categoryId of categoryIds) {
            await pool.query(sqlBoardgames.typeAlias("boardgame")`
                INSERT INTO board_games_categories (board_game_id, category_id)
                VALUES (${boardGameId}, ${categoryId})
            `);
        }
    }
    
    private async updateMechanics(boardGameId: string, mechanicIds: string[]) {
        const pool = await getPool();
        await pool.query(sqlBoardgames.typeAlias("boardgame")`
            DELETE FROM board_games_mechanics WHERE board_game_id = ${boardGameId}
        `);
        
        for (const mechanicId of mechanicIds) {
            await pool.query(sqlBoardgames.typeAlias("boardgame")`
                INSERT INTO board_games_mechanics (board_game_id, mechanic_id)
                VALUES (${boardGameId}, ${mechanicId})
            `);
        }
    }
    
    private async updatePublishers(boardGameId: string, publisherIds: string[]) {
        const pool = await getPool();
        await pool.query(sqlBoardgames.typeAlias("boardgame")`
            DELETE FROM board_games_publishers WHERE board_game_id = ${boardGameId}
        `);
        
        for (const publisherId of publisherIds) {
            await pool.query(sqlBoardgames.typeAlias("boardgame")`
                INSERT INTO board_games_publishers (board_game_id, publisher_id)
                VALUES (${boardGameId}, ${publisherId})
            `);
        }
    }
    
    private async updateDesigners(boardGameId: string, designerIds: string[]) {
        const pool = await getPool();
        await pool.query(sqlBoardgames.typeAlias("boardgame")`
            DELETE FROM board_games_designers WHERE board_game_id = ${boardGameId}
        `);
        
        for (const designerId of designerIds) {
            await pool.query(sqlBoardgames.typeAlias("boardgame")`
                INSERT INTO board_games_designers (board_game_id, person_id)
                VALUES (${boardGameId}, ${designerId})
            `);
        }
    }
    
    private async updateArtists(boardGameId: string, artistIds: string[]) {
        const pool = await getPool();
        await pool.query(sqlBoardgames.typeAlias("boardgame")`
            DELETE FROM board_games_artists WHERE board_game_id = ${boardGameId}
        `);
        
        for (const artistId of artistIds) {
            await pool.query(sqlBoardgames.typeAlias("boardgame")`
                INSERT INTO board_games_artists (board_game_id, person_id)
                VALUES (${boardGameId}, ${artistId})
            `);
        }
    }
    
    private async updateLinks(boardGameId: string, linkIds: string[]) {
        const pool = await getPool();
        await pool.query(sqlBoardgames.typeAlias("boardgame")`
            DELETE FROM board_games_links WHERE board_game_id = ${boardGameId}
        `);
        
        for (const linkId of linkIds) {
            await pool.query(sqlBoardgames.typeAlias("boardgame")`
                INSERT INTO board_games_links (board_game_id, link_id)
                VALUES (${boardGameId}, ${linkId})
            `);
        }
    }
}