CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" integer NOT NULL,
	"user_uuid" text NOT NULL,
	"offer_amount" numeric NOT NULL,
	"offer_time" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"user_uuid" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;