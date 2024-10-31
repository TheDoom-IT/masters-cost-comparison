CREATE TABLE IF NOT EXISTS "image_jobs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"bucket_key" varchar NOT NULL,
	"thumbnail_bucket_key" varchar,
	"blurred_bucket_key" varchar,
	"processing_time" integer,
    "processed_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL
);
