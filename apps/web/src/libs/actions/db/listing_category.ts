"use server";

import { db } from "@/libs/db/drizzle";
import { listing_category } from "@/libs/db/schema";

export async function getListingCategories() {
  const categories = await db.select().from(listing_category);
  return categories;
}
