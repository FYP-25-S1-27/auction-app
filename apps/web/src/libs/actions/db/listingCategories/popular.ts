"use server";

import { db } from "@/libs/db/drizzle";
import { listingCategory, listings } from "@/libs/db/schema";
import { sql } from "drizzle-orm";

export default async function getPopularCategories() {
  const result = await db
    .select({
      categoryName: listingCategory.name,
      parentCategoryName: listingCategory.parent,
      totalListings: sql<number>`COUNT(${listings.id})`,
    })
    .from(listingCategory)
    .leftJoin(listings, sql`${listingCategory.name} = ${listings.category}`)
    .groupBy(listingCategory.name)
    .orderBy(sql`COUNT(${listings.id}) DESC`)
    .limit(4);

  return result;
}
