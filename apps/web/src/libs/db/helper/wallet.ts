import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { wallets } from "../schema";

export async function seedWallets(userIds: string[]) {
  for (let i = 0; i < userIds.length; i++) {
    await db.insert(wallets).values({
      userUuid: userIds[i],
      balance: faker.number.int({ min: 50, max: 5000 }),
    });
  }
}
