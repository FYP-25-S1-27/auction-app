import { db } from "@/libs/db/drizzle";
import { listingCategory, listings, listingUserLikes } from "@/libs/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export type TopListingsInCategory = Awaited<ReturnType<typeof getTopListings>>;

async function getTopListings() {
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
    .innerJoin(listingUserLikes, eq(listings.id, listingUserLikes.listingId))
    .innerJoin(listingCategory, eq(listings.category, listingCategory.name))
    .groupBy(listingCategory.parent, listings.id, listings.name)
    .orderBy(listingCategory.parent, sql`like_count DESC`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const topListingsInCategory = await getTopListings();
  return NextResponse.json(topListingsInCategory, { status: 200 });
}
