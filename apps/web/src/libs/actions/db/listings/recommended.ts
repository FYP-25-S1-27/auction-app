"use server";

import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { and, eq, gt, inArray, sql } from "drizzle-orm";
import { getUserInterests } from "../userCategoryInterests";

export default async function getRecommendedListings(
  userInterests?: Awaited<ReturnType<typeof getUserInterests>>
) {
  const baseConditions = and(
    gt(listings.endTime, new Date().toISOString()),
    eq(listings.status, "ACTIVE")
  );
  // Only apply category filter if user has interests
  const whereCondition =
    userInterests && userInterests.length > 0
      ? and(
          baseConditions,
          inArray(
            listings.category,
            userInterests.map((interest) => interest.categoryName)
          )
        )
      : baseConditions;
  let recommendedItems = await db
    .select()
    .from(listings)
    .where(whereCondition)
    .orderBy(sql`RANDOM()`)
    .limit(20);
  if (recommendedItems.length === 0) {
    // If no recommended items, fallback to all active listings
    recommendedItems = await db
      .select()
      .from(listings)
      .where(baseConditions)
      .orderBy(sql`RANDOM()`)
      .limit(20);
  }
  return recommendedItems;
}
