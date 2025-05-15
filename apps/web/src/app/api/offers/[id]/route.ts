import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { bids } from "@/libs/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params; // Await the promise to get the actual params

    console.log("🔍 Fetching offers for request ID:", id);

    const offerHistory = await db
      .select({
        id: bids.id,
        user_uuid: bids.userUuid,
        bid_amount: bids.bidAmount,
        bid_time: bids.bidTime,
      })
      .from(bids)
      .where(
        and(
          eq(bids.listingId, id), // Must match the request ID
          eq(bids.type, "OFFER") // Only fetch "OFFER" entries)
        )
      )
      .orderBy(desc(bids.bidTime));

    console.log("📄 Retrieved Offers:", offerHistory);

    return NextResponse.json(offerHistory, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching offers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
