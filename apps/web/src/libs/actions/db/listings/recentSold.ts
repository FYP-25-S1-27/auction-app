"use server";

import { db } from "@/libs/db/drizzle";
import { listings, transactions } from "@/libs/db/schema";
import { eq, desc, and, isNotNull } from "drizzle-orm";

export default async function getRecentSoldTransaction() {
    const results = await db
    .select({
      id: listings.id,
      name: listings.name,
      userUuid: listings.userUuid,
      category: listings.category,
      description: listings.description,
      startingPrice: listings.startingPrice,
      currentPrice: transactions.salePrice, // override currentPrice with salePrice
      type: listings.type,
      endTime: listings.endTime,
      startTime: listings.startTime,
      status: listings.status,
      createdAt: listings.createdAt,
    })
    .from(listings)
    .innerJoin(transactions, eq(listings.id, transactions.listingId))
    .where(
      and(eq(listings.status, "SOLD"), isNotNull(transactions.salePrice))
    )
    .orderBy(desc(transactions.transactionDate))
    .limit(10);

  return results.map((r) => ({
    ...r,
    currentPrice: Number(r.currentPrice), 
  }));
}