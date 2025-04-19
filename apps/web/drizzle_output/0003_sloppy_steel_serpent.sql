ALTER TABLE "bids" ALTER COLUMN "bid_amount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "bids" ALTER COLUMN "bid_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;