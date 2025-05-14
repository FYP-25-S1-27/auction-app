"use server";

import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { addDays } from "date-fns";
import { and, eq, gt, lt, lte, sql } from "drizzle-orm";

export async function getEndingSoonListings() {
  const currentDate = new Date();

  // End of the current week (7 days from now)
  const endTime = addDays(currentDate, 7);
  // Start of the next day
  const startOfTomorrow = new Date(currentDate);
  startOfTomorrow.setHours(0, 0, 0, 0);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const result = await db
    .select()
    .from(listings)
    .where(
      and(
        lt(
          listings.endTime,
          sql`TO_TIMESTAMP(${endTime.toISOString()}, 'YYYY-MM-DDTHH24:MI:SS')`
        ), // only include listings ending within the week
        gt(listings.endTime, sql`CURRENT_TIMESTAMP`), // Exclude ended listings
        lte(listings.startTime, sql`CURRENT_TIMESTAMP`), // Only include listings that have started
        eq(listings.status, "ACTIVE")
      )
    )
    .orderBy(listings.endTime)
    .limit(10);

  return result;
}
