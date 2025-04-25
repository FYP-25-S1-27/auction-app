CREATE TYPE "public"."bid_types" AS ENUM('OFFER', 'BID');--> statement-breakpoint
CREATE TYPE "public"."listing_types" AS ENUM('REQUEST', 'LISTING');--> statement-breakpoint
ALTER TABLE "bids" ADD COLUMN "bid_types" "bid_types" DEFAULT 'BID' NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "listing_types" "listing_types" DEFAULT 'LISTING' NOT NULL;