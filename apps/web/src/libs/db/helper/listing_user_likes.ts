import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { listingUserLikes } from "../schema";

const COUNT = 200;

export async function seedUserLikes(listingIds: number[], userIds: string[]) {
  for (let i = 0; i < COUNT; i++) {
    const randomListingId = faker.helpers.arrayElement(listingIds);
    const randomUserId = faker.helpers.arrayElement(userIds);
    await db.insert(listingUserLikes).values({
      userUuid: randomUserId,
      listingId: randomListingId,
    });
  }
}
