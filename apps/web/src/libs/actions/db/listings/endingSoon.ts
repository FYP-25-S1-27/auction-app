"use server";

import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { and, gte, lte } from "drizzle-orm";

export async function getEndingSoonListings() {
  const currentDate = new Date();
  const endTime = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  const result = await db
    .select()
    .from(listings)
    .where(
      and(
        // eq(listings.status, "ACTIVE"),
        lte(listings.endTime, endTime.toISOString()),
        gte(listings.endTime, currentDate.toISOString())
      )
    )
    .orderBy(listings.endTime)
    .limit(10);

  return result;
}
