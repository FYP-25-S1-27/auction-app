import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { bids, listings } from "../schema";
import { desc, eq, InferSelectModel } from "drizzle-orm";

const COUNT = 100;

export async function seedBids(
  allListings: InferSelectModel<typeof listings>[],
  userIds: string[]
) {
  for (let i = 0; i < COUNT; i++) {
    const randomListing = faker.helpers.arrayElement(allListings);
    const randomUserId = faker.helpers.arrayElement(userIds);

    // check if there is already a previous bid
    const existingBid = await db
      .select()
      .from(bids)
      .where(eq(bids.listingId, randomListing.id))
      .orderBy(desc(bids.bidTime))
      .limit(1);

    const basePrice = () => {
      if (existingBid.length > 0) {
        return existingBid[0].bidAmount;
      } else if (randomListing.currentPrice) {
        return randomListing.currentPrice;
      } else {
        return randomListing.startingPrice;
      }
    };
    // if there are no bids, create a random bid
    const randomBidAmount = faker.number.int({
      min: basePrice(),
      max: basePrice() + 1000,
    });
    // console.log(randomListing.createdAt, randomListing.endTime);
    const randomBidTime = faker.date
      .between({
        from:
          existingBid.length > 0
            ? existingBid[0].bidTime
            : randomListing.createdAt,
        to:
          new Date(randomListing.endTime) < new Date()
            ? randomListing.endTime
            : new Date(),
      })
      .toISOString();

    const _bid = await db
      .insert(bids)
      .values({
        listingId: randomListing.id,
        userUuid: randomUserId,
        bidAmount: randomBidAmount,
        bidTime: randomBidTime,
      })
      .returning();

    // update the listing's current price
    await db
      .update(listings)
      .set({ currentPrice: _bid[0].bidAmount })
      .where(eq(listings.id, _bid[0].listingId));
  }
}
