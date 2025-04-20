import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { bids } from "@/libs/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await the promise to get the actual params
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid listing ID" },
        { status: 400 }
      );
    }

    const listing_id = Number(id); // Convert ID to number
    console.log("🔍 Fetching bids for listing ID:", listing_id);

    // Fetch bid history
    const bidHistory = await db
      .select({
        id: bids.id,
        user_uid: bids.userUuid,
        bid_amount: bids.bidAmount,
        bid_time: bids.bidTime,
      })
      .from(bids)
      .where(eq(bids.listingId, listing_id))
      .orderBy(desc(bids.bidTime)); // Most recent first

    console.log("📄 Retrieved Bids:", bidHistory);

    return NextResponse.json(bidHistory, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching bids:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}