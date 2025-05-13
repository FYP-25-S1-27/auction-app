import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { bids, listings, transactions } from "../schema";
import { desc, eq, InferSelectModel } from "drizzle-orm";

const COUNT = 20;

export async function seedTransactions(
  allListings: InferSelectModel<typeof listings>[],
  userIds: string[]
) {
  for (let i = 0; i < COUNT; i++) {
    const randomListing = faker.helpers.arrayElement(allListings);

    try {
      // make sure the latest bid is the one making the transaction
      let bid = await db
        .select()
        .from(bids)
        .where(eq(bids.listingId, randomListing.id))
        .orderBy(desc(bids.bidTime))
        .limit(1);

      // if there are no bids, create a random bid
      if (bid.length === 0) {
        const basePrice = () => {
          if (randomListing.currentPrice) {
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
        const randomBidTime = faker.date
          .between({
            from: randomListing.createdAt,
            to:
              new Date(randomListing.endTime) < new Date()
                ? randomListing.endTime
                : new Date(),
          })
          .toISOString();
        // filter out seller's userid
        const filteredUserIds = userIds.filter(
          (userId) => userId !== randomListing.userUuid
        );
        const randomUserId = faker.helpers.arrayElement(filteredUserIds);
        bid = await db
          .insert(bids)
          .values({
            listingId: randomListing.id,
            userUuid: randomUserId,
            bidAmount: randomBidAmount,
            bidTime: randomBidTime,
          })
          .returning();
      }

      const randomTransactionTime = faker.date.between({
        from: new Date(bid[0].bidTime),
        to: new Date(),
      });
      const randomUserId = faker.helpers.arrayElement(userIds);
      await db.insert(transactions).values({
        listingId: randomListing.id,
        buyerUuid: randomUserId,
        sellerUuid: randomListing.userUuid,
        salePrice: bid[0].bidAmount,
        transactionDate: randomTransactionTime.toISOString(),
      });

      // set the listing's status to SOLD and update the current price
      await db
        .update(listings)
        .set({ status: "SOLD", currentPrice: bid[0].bidAmount })
        .where(eq(listings.id, randomListing.id));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Check if the error is a duplicate key error
      if (error.code === "23505") {
        // Duplicate key error, skip this iteration
        // console.warn("Duplicate key detected, skipping:", error.detail);
        continue;
      }
      // Log other errors
      console.error("Error inserting transactions, retrying:", error);
    }
  }
}
