import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { bids } from "@/libs/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id);
    if (isNaN(requestId)) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
    }

    console.log("🔍 Fetching offers for request ID:", requestId);

    const offerHistory = await db
      .select({
        id: bids.id,
        user_uuid: bids.user_uuid,
        bid_amount: bids.bid_amount,
        bid_time: bids.bid_time,
      })
      .from(bids)
      .where(
        eq(bids.listing_id, requestId) // Must match the request ID
      )
      .where(
        eq(bids.bid_types, "OFFER") // Only fetch "OFFER" entries
      )
      .orderBy(desc(bids.bid_time));

    console.log("📄 Retrieved Offers:", offerHistory);

    return NextResponse.json(offerHistory, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching offers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}