import { getPool } from "../db/pool";
import { Link, linkSchema } from "../schemas/linkSchema";
import { createLogger } from "../utils/logger";
import { createSqlTag } from "slonik";

const logger = createLogger("linkRepository");
const sqlLinks = createSqlTag({
    typeAliases: {
        link: linkSchema,
    },
});

export class LinkRepository {
    async create(data: Omit<Link, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
        logger.debug("Creating link");
        const pool = await getPool();
        const result = await pool.one(sqlLinks.typeAlias("link")`
            INSERT INTO links (
                name,
                url,
                description,
                created_by
            ) VALUES (
                ${data.name},
                ${data.url},
                ${data.description},
                ${data.created_by}
            ) RETURNING *
        `);
        return result;
    }

    async findAll() {
        logger.debug("Finding all links");
        const pool = await getPool();
        const result = await pool.any(sqlLinks.typeAlias("link")`
            SELECT * FROM links WHERE deleted_at IS NULL
        `);
        return result;
    }

    async findById(id: string) {
        logger.debug("Finding link by id");
        const pool = await getPool();
        const result = await pool.one(sqlLinks.typeAlias("link")`
            SELECT * FROM links WHERE id = ${id} AND deleted_at IS NULL
        `);
        return result;
    }

    async findSoftDeleted() {
        logger.debug("Finding soft deleted links");
        const pool = await getPool();
        const result = await pool.any(sqlLinks.typeAlias("link")` SELECT * FROM links WHERE deleted_at IS NOT NULL`);
        return result;
    }

    async update(id: string, data: Partial<Omit<Link, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>) {
        logger.debug("Updating link");
        const pool = await getPool();
        const result = await pool.one(sqlLinks.typeAlias("link")`
            UPDATE links SET
                name = ${data.name},
                url = ${data.url},
                description = ${data.description}
            WHERE id = ${id} AND deleted_at IS NULL RETURNING *
        `);
        return result;
    }

    async softDelete(id: string) {
        logger.debug("Soft deleting link");
        const pool = await getPool();
        const result = await pool.one(sqlLinks.typeAlias("link")`
            UPDATE links SET deleted_at = NOW() WHERE id = ${id} AND deleted_at IS NULL RETURNING *
        `);
        return result;
    }

    async hardDelete(id: string) {
        logger.debug("Hard deleting link");
        const pool = await getPool();
        const result = await pool.one(sqlLinks.typeAlias("link")`
            DELETE FROM links WHERE id = ${id} RETURNING *
        `);
        return result;
    }

    async restore(id: string) {
        logger.debug("Restoring link");
        const pool = await getPool();
        const result = await pool.one(sqlLinks.typeAlias("link")`
            UPDATE links SET deleted_at = NULL WHERE id = ${id} AND deleted_at IS NOT NULL RETURNING *
        `);
        return result;
    }
}