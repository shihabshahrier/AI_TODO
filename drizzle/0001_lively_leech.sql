ALTER TABLE "todos" ADD COLUMN "created_at" timestamp DEFAULT 'now()' NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "updated_at" timestamp DEFAULT 'now()' NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "timestamp";