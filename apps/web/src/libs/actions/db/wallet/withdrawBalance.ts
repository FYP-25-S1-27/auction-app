"use server";

import { auth0 } from "@/libs/auth0";
import { db } from "@/libs/db/drizzle";
import { wallets } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export default async function withdrawBalance(amount: number) {
  const session = await auth0.getSession();
  if (!session) {
    return "Unauthorized";
  }
  const userUuid = session.user.sub;
  const currentWallet = await db
    .select({
      balance: wallets.balance,
    })
    .from(wallets)
    .where(eq(wallets.userUuid, userUuid))
    .limit(1);

  if (currentWallet.length === 0) {
    return "Wallet not found";
  }

  const newBalance = currentWallet[0].balance - amount;

  await db
    .update(wallets)
    .set({
      balance: newBalance,
    })
    .where(eq(wallets.userUuid, userUuid))
    .returning();
}
