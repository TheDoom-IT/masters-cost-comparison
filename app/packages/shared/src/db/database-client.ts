import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { imageJobs } from "./schema.js";
import { eq, InferSelectModel } from "drizzle-orm";
import * as path from "path";
import { PgUpdateSetSource } from "drizzle-orm/pg-core/query-builders/update";

export class DatabaseClient {
    private static _instance: DatabaseClient;
    private readonly db: ReturnType<typeof drizzle>;

    private constructor(connectionString: string) {
        this.db = drizzle(connectionString);
    }

    static get instance(): DatabaseClient {
        if (!this._instance) {
            this._instance = new DatabaseClient(process.env.DATABASE_URL!);
        }

        return this._instance;
    }

    async migrate() {
        await migrate(this.db, {
            migrationsFolder: path.join(
                import.meta.dirname,
                "..",
                "..",
                "drizzle",
            ),
            migrationsSchema: path.join(import.meta.dirname, "schema.js"),
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

    async getImageJobs(): Promise<InferSelectModel<typeof imageJobs>[]> {
        return await this.db.select().from(imageJobs).execute();
    }
}
