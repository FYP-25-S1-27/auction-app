import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { user_category_interests } from "../schema";
import { CATEGORIES } from "./categories_listing_and_images";

const COUNT = 100;

export async function seedUserInterests(userIds: string[]) {
  const flattenedCategories = Object.values(CATEGORIES).flat();
  for (let i = 0; i < COUNT; i++) {
    try {
      const randomCategory = faker.helpers.arrayElement(flattenedCategories);
      const randomUserId = faker.helpers.arrayElement(userIds);
      await db.insert(user_category_interests).values({
        userUuid: randomUserId,
        categoryName: randomCategory,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Check if the error is a duplicate key error
      if (error.code === "23505") {
        // Duplicate key error, skip this iteration
        console.warn(
          "Duplicate key detected, skipping iteration:",
          error.detail
        );
        i--; // Decrement the counter to retry this iteration
        continue;
      }
      // Log other errors
      console.error("Error inserting user interest, retrying:", error);
    }
  }
}
