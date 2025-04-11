ALTER TABLE "user_profile" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "age" integer;--> statement-breakpoint
ALTER TABLE "user_profile" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "user_profile" DROP COLUMN "last_name";--> statement-breakpoint
ALTER TABLE "user_profile" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "user_profile" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "user_profile" DROP COLUMN "state";--> statement-breakpoint
ALTER TABLE "user_profile" DROP COLUMN "country";--> statement-breakpoint
ALTER TABLE "user_profile" DROP COLUMN "zip_code";--> statement-breakpoint
ALTER TABLE "user_profile" DROP COLUMN "profile_picture";