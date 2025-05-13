import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { bids, listings } from "../schema";
import { eq, InferSelectModel } from "drizzle-orm";

const COUNT = 100;

export async function seedBids(
  allListings: InferSelectModel<typeof listings>[],
  userIds: string[]
) {
  for (let i = 0; i < COUNT; i++) {
    const randomListing = faker.helpers.arrayElement(allListings);
    const randomUserId = faker.helpers.arrayElement(userIds);
    const randomBidAmount = faker.number.int({
      min: randomListing.currentPrice || randomListing.startingPrice,
      max: (randomListing.currentPrice || randomListing.startingPrice) + 1000,
    });
    const randomBidTime = faker.date.recent({ days: 10 }).toISOString();

    await db.insert(bids).values({
      listingId: randomListing.id,
      userUuid: randomUserId,
      bidAmount: randomBidAmount,
      bidTime: randomBidTime,
    });

    // update the listing's current price
    await db
      .update(listings)
      .set({ currentPrice: randomBidAmount })
      .where(eq(listings.id, randomListing.id));
  }
}
