import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { bids } from "../schema";

faker.seed(321);
const COUNT = 100;

export async function seedBids(listingIds: number[], userIds: string[]) {
  for (let i = 0; i < COUNT; i++) {
    const randomListingId = faker.helpers.arrayElement(listingIds);
    const randomUserId = faker.helpers.arrayElement(userIds);
    const randomBidAmount = faker.number.int({ min: 1, max: 1000 });
    const randomBidTime = faker.date.recent({ days: 10 }).toISOString();

    await db.insert(bids).values({
      listingId: randomListingId,
      userUuid: randomUserId,
      bidAmount: randomBidAmount,
      bidTime: randomBidTime,
    });
  }
}
