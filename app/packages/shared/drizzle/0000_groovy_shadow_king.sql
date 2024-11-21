CREATE TABLE IF NOT EXISTS "jobs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"type" varchar NOT NULL,
	"processing_time" integer,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
