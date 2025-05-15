import { NextRequest, NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { bids } from "@/libs/db/schema";
import { eq, and, desc } from "drizzle-orm";

// GET offers for a specific listing/request
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id);
    const offers = await db
      .select({
        id: bids.id,
        user_uuid: bids.userUuid,
        bid_amount: bids.bidAmount,
        bid_time: bids.bidTime,
      })
      .from(bids)
      .where(and(eq(bids.listingId, requestId), eq(bids.type, "OFFER")))
      .orderBy(desc(bids.bidTime));

    return NextResponse.json(offers);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT to update an offer
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const offerId = parseInt(params.id);
    const body = await req.json();
    const { bid_amount } = body;

    if (!bid_amount || typeof bid_amount !== "number") {
      return NextResponse.json(
        { error: "Invalid bid_amount" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(bids)
      .set({ bidAmount: bid_amount })
      .where(eq(bids.id, offerId));

    return NextResponse.json({ message: "Offer updated", updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update offer" },
      { status: 500 }
    );
  }
}

// DELETE to remove an offer
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const offerId = parseInt(params.id);

    const deleted = await db.delete(bids).where(eq(bids.id, offerId));

    return NextResponse.json({ message: "Offer deleted", deleted });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete offer" },
      { status: 500 }
    );
  }
}
