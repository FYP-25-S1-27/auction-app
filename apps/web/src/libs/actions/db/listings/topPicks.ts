"use server";
import { db } from "@/libs/db/drizzle";
import { listingCategory, listings, listingUserLikes } from "@/libs/db/schema";
import { and, eq, gt, lte, sql } from "drizzle-orm";

export default async function getTopListings() {
  return db
    .selectDistinctOn([listingCategory.parent], {
      id: listings.id,
      name: listings.name,
      startingPrice: listings.startingPrice,
      userUuid: listings.userUuid,
      currentPrice: listings.currentPrice,
      startTime: listings.startTime,
      createdAt: listings.createdAt,
      status: listings.status,
      endTime: listings.endTime,
      type: listings.type,
      category: listings.category,
      description: listings.description,
      listingId: listings.id,
      listingName: listings.name,
      likeCount: sql`COUNT(${listingUserLikes.userUuid})`.as("like_count"),
    })
    .from(listings)
    .where(
      and(
        gt(listings.endTime, new Date().toISOString()),
        eq(listings.status, "ACTIVE"),
        lte(listings.startTime, sql`CURRENT_TIMESTAMP`) // Only include listings that have started
      )
    )
    .innerJoin(listingUserLikes, eq(listings.id, listingUserLikes.listingId))
    .innerJoin(listingCategory, eq(listings.category, listingCategory.name))
    .groupBy(listingCategory.parent, listings.id, listings.name)
    .orderBy(listingCategory.parent, sql`like_count DESC`);
}
