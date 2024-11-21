import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { jobsTable } from "./schema.js";
import { eq, InferSelectModel, count, desc } from "drizzle-orm";
import * as path from "path";
import { PgUpdateSetSource } from "drizzle-orm/pg-core/query-builders/update";
import { JobType, PaginationParams } from "../models/index.js";
import { PaginatedQuery } from "../models/paginated-query.js";
import pg from "pg";

export class DatabaseClient {
    private readonly db: ReturnType<typeof drizzle>;
    private readonly pool: pg.Pool;

    constructor() {
        const connectionString = process.env.DATABASE_URL!;
        this.pool = new pg.Pool({ connectionString });
        this.db = drizzle(this.pool);
    }

    async close() {
        await this.pool.end();
    }

    async migrate() {
        await migrate(this.db, {
            migrationsFolder: path.join(
                import.meta.dirname,
                "..",
                "..",
                "drizzle",
            ),
            migrationsSchema: "public",
            migrationsTable: "migrations",
        });
    }

    async addJob(id: string, type: JobType) {
        await this.db.insert(jobsTable).values({
            id,
            type,
        });
    }

    async updateJob(
        id: string,
        updateFields: PgUpdateSetSource<typeof jobsTable>,
    ) {
        await this.db
            .update(jobsTable)
            .set(updateFields)
            .where(eq(jobsTable.id, id))
            .execute();
    }

    async getJobs(
        pagination: PaginationParams,
    ): Promise<PaginatedQuery<InferSelectModel<typeof jobsTable>>> {
        const offset = pagination.limit * (pagination.page - 1);

        const jobsPromise = this.db
            .select()
            .from(jobsTable)
            .orderBy(desc(jobsTable.createdAt))
            .offset(offset)
            .limit(pagination.limit)
            .execute();
        const jobsCountPromise = this.db
            .select({ count: count() })
            .from(jobsTable)
            .execute();

        const [items, jobsCount] = await Promise.all([
            jobsPromise,
            jobsCountPromise,
        ]);

        return {
            items,
            totalItems: jobsCount[0].count,
        };
    }
}
