import { pgTable, integer, varchar, timestamp } from "drizzle-orm/pg-core";

export const imageJobs = pgTable("image_jobs", {
    id: varchar("id").primaryKey(),
    bucketKey: varchar("bucket_key").notNull(),
    thumbnailBucketKey: varchar("thumbnail_bucket_key"),
    blurredBucketKey: varchar("blurred_bucket_key"),
    processingTime: integer("processing_time"),
    processedAt: timestamp("processed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
