import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { user_category_interests } from "../schema";
import { CATEGORIES } from "./categories_listing_and_images";

faker.seed(321);
const COUNT = 100;

export async function seedUserInterests(userIds: string[]) {
  const flattenedCategories = Object.values(CATEGORIES).flat();
  for (let i = 0; i < COUNT; i++) {
    const randomCategory = faker.helpers.arrayElement(flattenedCategories);
    const randomUserId = faker.helpers.arrayElement(userIds);
    await db.insert(user_category_interests).values({
      userUuid: randomUserId,
      categoryName: randomCategory,
    });
  }
}
