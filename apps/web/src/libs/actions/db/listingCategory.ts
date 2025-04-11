"use server";

import { db } from "@/libs/db/drizzle";
import { listingCategory } from "@/libs/db/schema";

export async function getListingCategories() {
  const categories = await db.select().from(listingCategory);
  return categories;
}
