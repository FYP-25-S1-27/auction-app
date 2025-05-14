import { NextRequest, NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { bids } from "@/libs/db/schema";
import { eq, desc, and } from "drizzle-orm";

// GET: Fetch all offers for a specific request/listing
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;
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
          eq(bids.listingId, id),
          eq(bids.type, "OFFER")
        )
      )
      .orderBy(desc(bids.bidTime));

    return NextResponse.json(offerHistory, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching offers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Retract (remove) an offer
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const offerId = parseInt(params.id);

    if (isNaN(offerId)) {
      return NextResponse.json({ error: "Invalid offer ID" }, { status: 400 });
    }

    await db.delete(bids).where(eq(bids.id, offerId));

    return NextResponse.json({ success: true, message: "Offer retracted" });
  } catch (error) {
    console.error("❌ Error deleting offer:", error);
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}

// PUT: Adjust the offer amount
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const offerId = parseInt(params.id);
    const body = await req.json();
    const { bid_amount } = body;

    if (!bid_amount || isNaN(offerId)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await db
      .update(bids)
      .set({ bidAmount: bid_amount })
      .where(eq(bids.id, offerId));

    return NextResponse.json({ success: true, message: "Offer updated" });
  } catch (error) {
    console.error("❌ Error updating offer:", error);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}
