import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { and, eq, lt, gte } from "drizzle-orm";

export async function GET() {
  try {
    const now = new Date().toISOString();

    const endingSoonListings = await db
      .select()
      .from(listings)
      .where(
        and(
          eq(listings.status, "ACTIVE"),            // Still active
          eq(listings.listing_types, "LISTING"),      // Only auction listings (not requests)
          gte(listings.end_time, now)                // End time must still be in the future
        )
      )
      .orderBy(lt(listings.end_time, now))           // Closest to ending first
      .limit(8);                                     // Limit to top 8 listings

    return NextResponse.json(endingSoonListings, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching ending soon listings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
