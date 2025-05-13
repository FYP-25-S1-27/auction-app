"use server";

import { db } from "@/libs/db/drizzle";
import { bids } from "@/libs/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function getLatestBids(listingId: number) {
  const result = await db
    .select()
    .from(bids)
    .where(eq(bids.listingId, listingId))
    .limit(5)
    .orderBy(desc(bids.bidTime));
  return result;
}
