import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { listings, transactions } from "../schema";
import { eq, sql } from "drizzle-orm";
import { addDays } from "date-fns";

const COUNT = 50;

export async function seedTransactions(
  listingIds: number[],
  userIds: string[]
) {
  for (let i = 0; i < COUNT; i++) {
    const randomListing = await db
      .select()
      .from(listings)
      .where(eq(listings.status, "SOLD"))
      .orderBy(sql`RANDOM()`)
      .limit(1);
    const randomBuyerId = faker.helpers.arrayElement(userIds);
    const randomSellerId = faker.helpers.arrayElement(userIds);
    const randomSalePrice = faker.number.int({
      min: randomListing[0].startingPrice,
      max: randomListing[0].startingPrice + 1000,
    });
    const randomTransactionTime = faker.date.between({
      from: new Date(randomListing[0].createdAt),
      to: addDays(new Date(randomListing[0].createdAt), 30),
    });
    try {
      await db.insert(transactions).values({
        listingId: randomListing[0].id,
        buyerUuid: randomBuyerId,
        sellerUuid: randomSellerId,
        salePrice: randomSalePrice.toString(),
        transactionDate: randomTransactionTime.toISOString(),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Check if the error is a duplicate key error
      if (error.code === "23505") {
        // Duplicate key error, skip this iteration
        console.warn("Duplicate key detected, skipping:", error.detail);
        continue;
      }
      // Log other errors
      console.error("Error inserting user interest, retrying:", error);
    }
  }
}
