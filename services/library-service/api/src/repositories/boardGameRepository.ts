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
        if (data.awards && data.awards.length > 0) {
            await this.updateAwards(result.id, data.awards);
        }
        
        if (data.categories && data.categories.length > 0) {
            await this.updateCategories(result.id, data.categories);
        }
        
        if (data.mechanics && data.mechanics.length > 0) {
            await this.updateMechanics(result.id, data.mechanics);
        }
        
        if (data.publishers && data.publishers.length > 0) {
            await this.updatePublishers(result.id, data.publishers);
        }
        
        if (data.designers && data.designers.length > 0) {
            await this.updateDesigners(result.id, data.designers);
        }
        
        if (data.artists && data.artists.length > 0) {
            await this.updateArtists(result.id, data.artists);
        }
        
        if (data.links && data.links.length > 0) {
            await this.updateLinks(result.id, data.links);
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
        logger.debug("Finding board game by id");
        const pool = await getPool();
        const result = await pool.maybeOne(sqlBoardgames.typeAlias("boardgame")`
            SELECT * FROM board_games WHERE id = ${id} AND deleted_at IS NULL
        `);
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
            await this.updateAwards(result.id, data.awards || []);
        }
        
        if (data.categories !== undefined) {
            await this.updateCategories(result.id, data.categories || []);
        }
        
        if (data.mechanics !== undefined) {
            await this.updateMechanics(result.id, data.mechanics || []);
        }
        
        if (data.publishers !== undefined) {
            await this.updatePublishers(result.id, data.publishers || []);
        }
        
        if (data.designers !== undefined) {
            await this.updateDesigners(result.id, data.designers || []);
        }
        
        if (data.artists !== undefined) {
            await this.updateArtists(result.id, data.artists || []);
        }
        
        if (data.links !== undefined) {
            await this.updateLinks(result.id, data.links || []);
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
        await pool.query(sqlBoardgames.typeAlias("void")`
            DELETE FROM board_games_awards_awards WHERE "boardgameId" = ${boardGameId}
        `);
        
        // Neue Einträge hinzufügen
        for (const awardId of awardIds) {
            await pool.query(sqlBoardgames.typeAlias("void")`
                INSERT INTO boardgames_awards_awards ("boardgameId", "awardId")
                VALUES (${boardGameId}, ${awardId})
            `);
        }
    }
    
    private async updateCategories(boardGameId: string, categoryIds: string[]) {
        const pool = await getPool();
        await pool.query(sqlBoardgames.typeAlias("void")`
            DELETE FROM board_games_categories_categories WHERE "boardgameId" = ${boardGameId}
        `);
        
        for (const categoryId of categoryIds) {
            await pool.query(sqlBoardgames.typeAlias("void")`
                INSERT INTO board_games_categories_categories ("boardgameId", "categoryId")
                VALUES (${boardGameId}, ${categoryId})
            `);
        }
    }
    
    private async updateMechanics(boardGameId: string, mechanicIds: string[]) {
        const pool = await getPool();
        await pool.query(sqlBoardgames.typeAlias("void")`
            DELETE FROM board_games_mechanics_mechanics WHERE "boardgameId" = ${boardGameId}
        `);
        
        for (const mechanicId of mechanicIds) {
            await pool.query(sqlBoardgames.typeAlias("void")`
                INSERT INTO board_games_mechanics_mechanics ("boardgameId", "mechanicId")
                VALUES (${boardGameId}, ${mechanicId})
            `);
        }
    }
    
    private async updatePublishers(boardGameId: string, publisherIds: string[]) {
        const pool = await getPool();
        await pool.query(sqlBoardgames.typeAlias("void")`
            DELETE FROM board_games_publishers_publishers WHERE "boardgameId" = ${boardGameId}
        `);
        
        for (const publisherId of publisherIds) {
            await pool.query(sqlBoardgames.typeAlias("void")`
                INSERT INTO board_games_publishers_publishers ("boardgameId", "publisherId")
                VALUES (${boardGameId}, ${publisherId})
            `);
        }
    }
    
    private async updateDesigners(boardGameId: string, designerIds: string[]) {
        const pool = await getPool();
        await pool.query(sqlBoardgames.typeAlias("void")`
            DELETE FROM boardgames_designers_people WHERE "boardgameId" = ${boardGameId}
        `);
        
        for (const designerId of designerIds) {
            await pool.query(sqlBoardgames.typeAlias("void")`
                INSERT INTO boardgames_designers_people ("boardgameId", "personId")
                VALUES (${boardGameId}, ${designerId})
            `);
        }
    }
    
    private async updateArtists(boardGameId: string, artistIds: string[]) {
        const pool = await getPool();
        await pool.query(sqlBoardgames.typeAlias("void")`
            DELETE FROM boardgames_artists_people WHERE "boardgameId" = ${boardGameId}
        `);
        
        for (const artistId of artistIds) {
            await pool.query(sqlBoardgames.typeAlias("void")`
                INSERT INTO boardgames_artists_people ("boardgameId", "personId")
                VALUES (${boardGameId}, ${artistId})
            `);
        }
    }
    
    private async updateLinks(boardGameId: string, linkIds: string[]) {
        const pool = await getPool();
        await pool.query(sqlBoardgames.typeAlias("void")`
            UPDATE links SET "boardgameId" = NULL WHERE "boardgameId" = ${boardGameId}
        `);
        
        for (const linkId of linkIds) {
            await pool.query(sqlBoardgames.typeAlias("void")`
                UPDATE links SET "boardgameId" = ${boardGameId} WHERE id = ${linkId}
            `);
        }
    }
}