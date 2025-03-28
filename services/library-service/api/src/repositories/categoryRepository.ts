import { getPool } from "../db/pool";
import { Category, categorySchema } from "../schemas/categorySchema";
import { createLogger } from "../utils/logger";
import { createSqlTag } from "slonik";

const logger = createLogger("categoryRepository");
const sqlCategories = createSqlTag({
    typeAliases: {
        category: categorySchema
    },
});

export class CategoryRepository {
    async create(data: Omit<Category, "id" | "createdAt" | "updatedAt" | "deletedAt">) {
        logger.debug("Creating category");
        const pool = await getPool();
        const result = await pool.one(sqlCategories.typeAlias("category")`
            INSERT INTO categories (name, description)
            VALUES (${data.name}, ${data.description})
            RETURNING *
        `);
        return result;
    }    
    
    async findAll() {
        logger.debug("Finding all categories");
        const pool = await getPool();
        const result = await pool.any(sqlCategories.typeAlias("category")`
        SELECT * FROM categories WHERE deleted_at IS NULL
    `);
        return result;
    }

    async findById(id: string) {
        logger.debug("Finding category by id with related board games");
        const pool = await getPool();
        
        const result = await pool.maybeOne(sqlCategories.typeAlias("category")`
            SELECT c.*,
                   COALESCE(
                       jsonb_agg(
                           DISTINCT jsonb_build_object(
                               'id', bg.id,
                               'name', bg.name,
                               'description', bg.description,
                               'min_players', bg.min_players,
                               'max_players', bg.max_players,
                               'min_playtime', bg.min_playtime,
                               'max_playtime', bg.max_playtime,
                               'year_published', bg.year_published,
                               'created_at', bg.created_at,
                               'updated_at', bg.updated_at
                           )
                       ) FILTER (WHERE bg.id IS NOT NULL),
                       '[]'::jsonb
                   ) AS board_games
            FROM categories c
            LEFT JOIN board_games_categories bgc ON c.id = bgc.category_id
            LEFT JOIN board_games bg ON bgc.board_game_id = bg.id AND bg.deleted_at IS NULL
            WHERE c.id = ${id} AND c.deleted_at IS NULL
            GROUP BY c.id
        `);
        
        return result;
    }

    async findSoftDeleted() {
        logger.debug("Finding soft deleted categories");
        const pool = await getPool();
        const result = await pool.any(sqlCategories.typeAlias("category")`
            SELECT * FROM categories WHERE deleted_at IS NOT NULL
        `);
        return result;
    }

    async update(id: string, data: Partial<Category>) {
        logger.debug("Updating category");
        const pool = await getPool();
        const result = await pool.one(sqlCategories.typeAlias("category")`
            UPDATE categories SET
                name = COALESCE(${data.name}, name),
                description = COALESCE(${data.description}, description),
                updated_at = NOW()
            WHERE id = ${id} AND deleted_at IS NULL
            RETURNING *
        `);
        return result;
    }

    async softDelete(id: string) {
        logger.debug("Soft deleting category");
        const pool = await getPool();
        const result = await pool.one(sqlCategories.typeAlias("category")`
            UPDATE categories SET
                deleted_at = NOW()
            WHERE id = ${id} AND deleted_at IS NULL
            RETURNING *
        `);
        return result;
    }

    async hardDelete(id: string) {
        logger.debug("Hard deleting category");
        const pool = await getPool();
        const result = await pool.one(sqlCategories.typeAlias("category")`
            DELETE FROM categories WHERE id = ${id} RETURNING *
        `);
        return result;
    }

    async restore(id: string) {
        logger.debug("Restoring category");
        const pool = await getPool();
        const result = await pool.one(sqlCategories.typeAlias("category")`
            UPDATE categories SET
                deleted_at = NULL
            WHERE id = ${id} AND deleted_at IS NOT NULL
            RETURNING *
        `);
        return result;
    }
};