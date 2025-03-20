import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { bids } from "@/libs/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const id = context.params?.id;  // Ensure params exist before destructuring
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
    }

    const listing_id = Number(id); // Convert ID to number
    console.log("🔍 Fetching bids for listing ID:", listing_id);

    // Fetch bid history
    const bidHistory = await db
      .select({
        id: bids.id,
        user_uuid: bids.user_uuid,
        bid_amount: bids.bid_amount,
        bid_time: bids.bid_time,
      })
      .from(bids)
      .where(eq(bids.listing_id, listing_id))
      .orderBy(desc(bids.bid_time)); // Most recent first

    console.log("📄 Retrieved Bids:", bidHistory);

    return NextResponse.json(bidHistory, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching bids:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
