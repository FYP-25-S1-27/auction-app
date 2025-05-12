"use server";

import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { and, eq, gt, sql } from "drizzle-orm";

export default async function getRecommendedListings() {
  const recommendedItems = await db
    .select()
    .from(listings)
    .where(
      and(
        gt(listings.endTime, new Date().toISOString()),
        eq(listings.status, "ACTIVE")
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(20);
  return recommendedItems;
}
