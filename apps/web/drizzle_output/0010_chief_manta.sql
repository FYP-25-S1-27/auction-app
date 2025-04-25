ALTER TABLE "bids" RENAME TO "bids_and_offers";--> statement-breakpoint
ALTER TABLE "listings" RENAME TO "listings_and_requests";--> statement-breakpoint
ALTER TABLE "bids_and_offers" DROP CONSTRAINT "bids_listing_id_fkey";
--> statement-breakpoint
ALTER TABLE "bids_and_offers" DROP CONSTRAINT "bids_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "listing_images" DROP CONSTRAINT "listing_images_listing_id_fkey";
--> statement-breakpoint
ALTER TABLE "user_listing_likes" DROP CONSTRAINT "user_listing_likes_listing_id_fkey";
--> statement-breakpoint
ALTER TABLE "listings_and_requests" DROP CONSTRAINT "listings_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "listings_and_requests" DROP CONSTRAINT "listings_category_id_fkey";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_listing_id_fkey";
--> statement-breakpoint
ALTER TABLE "bids_and_offers" ADD CONSTRAINT "bids_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings_and_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bids_and_offers" ADD CONSTRAINT "bids_user_id_fkey" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings_and_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_listing_likes" ADD CONSTRAINT "user_listing_likes_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings_and_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings_and_requests" ADD CONSTRAINT "listings_user_id_fkey" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings_and_requests" ADD CONSTRAINT "listings_category_id_fkey" FOREIGN KEY ("category") REFERENCES "public"."listing_category"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings_and_requests"("id") ON DELETE cascade ON UPDATE no action;