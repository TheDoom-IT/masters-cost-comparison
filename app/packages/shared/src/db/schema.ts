import { pgTable, integer, varchar, timestamp } from "drizzle-orm/pg-core";

export const jobsTable = pgTable("jobs", {
    id: varchar("id").primaryKey(),
    type: varchar("type").notNull(),
    processingTime: integer("processing_time"),
    processedAt: timestamp("processed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
