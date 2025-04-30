import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { transactions } from "../schema";

faker.seed(321);
const COUNT = 100;

export async function seedTransactions(
  listingIds: number[],
  userIds: string[]
) {
  for (let i = 0; i < COUNT; i++) {
    const randomListingId = faker.helpers.arrayElement(listingIds);
    const randomBuyerId = faker.helpers.arrayElement(userIds);
    const randomSellerId = faker.helpers.arrayElement(userIds);
    const randomSalePrice = faker.number.int({ min: 1, max: 1000 });
    const randomTransactionTime = faker.date.past({ years: 1 }).toISOString();
    await db.insert(transactions).values({
      listingId: randomListingId,
      buyerUuid: randomBuyerId,
      sellerUuid: randomSellerId,
      salePrice: randomSalePrice.toString(),
      transactionDate: randomTransactionTime,
    });
  }
}
