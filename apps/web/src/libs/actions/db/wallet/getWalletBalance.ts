"use server";

import { db } from "@/libs/db/drizzle";
import { wallets } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export default async function getWalletBalance(uuid: string) {
  const result = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userUuid, uuid))
    .limit(1); // there should be only one anyways as a user can only have one wallet

  if (result.length === 0) {
    // create a new wallet if it doesn't exist
    const _result = await db
      .insert(wallets)
      .values({ userUuid: uuid, balance: 0 })
      .returning();
    return _result[0].balance;
  }
  // if it exists, return the wallet
  return result[0].balance;
}
