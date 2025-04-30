CREATE TABLE "user_category_interests" (
	"useruuid" text NOT NULL,
	"categoryname" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listings_and_requests" ADD COLUMN "start_time" timestamp;--> statement-breakpoint
ALTER TABLE "user_category_interests" ADD CONSTRAINT "user_category_interests_useruuid_user_profile_user_uuid_fk" FOREIGN KEY ("useruuid") REFERENCES "public"."user_profile"("user_uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_category_interests" ADD CONSTRAINT "user_category_interests_categoryname_listing_category_name_fk" FOREIGN KEY ("categoryname") REFERENCES "public"."listing_category"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_category_interests" ADD CONSTRAINT "user_interests_user_id_fkey" FOREIGN KEY ("useruuid") REFERENCES "public"."user_profile"("user_uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_category_interests" ADD CONSTRAINT "user_interests_category_id_fkey" FOREIGN KEY ("categoryname") REFERENCES "public"."listing_category"("name") ON DELETE cascade ON UPDATE no action;