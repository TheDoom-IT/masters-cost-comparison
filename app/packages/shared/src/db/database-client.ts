import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { imageJobs } from "./schema.js";
import { eq, InferSelectModel, count, desc } from "drizzle-orm";
import * as path from "path";
import { PgUpdateSetSource } from "drizzle-orm/pg-core/query-builders/update";
import { PaginationParams } from "../models/index.js";
import { PaginatedQuery } from "../models/paginated-query.js";

export class DatabaseClient {
    private readonly db: ReturnType<typeof drizzle>;

    constructor() {
        const connectionString = process.env.DATABASE_URL!;
        this.db = drizzle(connectionString);
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

    async addImageJob(id: string, bucketKey: string) {
        await this.db.insert(imageJobs).values({
            id,
            bucketKey,
        });
    }

    async updateImageJob(
        id: string,
        updateFields: PgUpdateSetSource<typeof imageJobs>,
    ) {
        await this.db
            .update(imageJobs)
            .set(updateFields)
            .where(eq(imageJobs.id, id))
            .execute();
    }

    async getImageJobs(
        pagination: PaginationParams,
    ): Promise<PaginatedQuery<InferSelectModel<typeof imageJobs>>> {
        const offset = pagination.limit * (pagination.page - 1);

        const jobsPromise = this.db
            .select()
            .from(imageJobs)
            .orderBy(desc(imageJobs.createdAt))
            .offset(offset)
            .limit(pagination.limit)
            .execute();
        const jobsCountPromise = this.db
            .select({ count: count() })
            .from(imageJobs)
            .execute();

        const [jobs, jobsCount] = await Promise.all([
            jobsPromise,
            jobsCountPromise,
        ]);

        return {
            items: jobs,
            totalItems: jobsCount[0].count,
        };
    }
}
