"use server";

import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { sql } from "drizzle-orm";

export default async function getRecommendedListings() {
  const recommendedItems = await db
    .select()
    .from(listings)
    .orderBy(sql`RANDOM()`)
    .limit(20);
  return recommendedItems;
}
