import { NextRequest, NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { bids } from "@/libs/db/schema";
import { eq, and, desc } from "drizzle-orm";

// ✅ GET: Fetch offers filtered by user_uuid
export async function GET(req: NextRequest) {
  try {
    const userUuid = req.nextUrl.searchParams.get("user_uuid");

    if (!userUuid) {
      return NextResponse.json(
        { error: "Missing user_uuid" },
        { status: 400 }
      );
    }

    const userOffers = await db
      .select()
      .from(bids)
      .where(eq(bids.userUuid, userUuid))
      .orderBy(desc(bids.bidTime));

    return NextResponse.json(userOffers);
  } catch (error) {
    console.error("❌ Failed to fetch offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch offers." },
      { status: 500 }
    );
  }
}

// ✅ POST: Submit new offer (with match offer + dedup logic)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listing_id, bid_amount: initialBidAmount, bid_type, user_uuid } = body;

    // ✅ Validate input
    if (!listing_id || typeof initialBidAmount !== "number" || !bid_type || !user_uuid) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // ✅ Reject negative values early
    if (initialBidAmount < 0) {
      return NextResponse.json(
        { error: "Offer amount cannot be negative." },
        { status: 400 }
      );
    }

    let bid_amount = initialBidAmount;

    // ✅ Server-side "Match Offer" logic
    if (bid_amount === 0 && bid_type === "OFFER") {
      const [topOffer] = await db
        .select({ bidAmount: bids.bidAmount })
        .from(bids)
        .where(and(eq(bids.listingId, listing_id), eq(bids.type, "OFFER")))
        .orderBy(desc(bids.bidAmount))
        .limit(1);

      const defaultMatchAmount = 100;
      bid_amount = topOffer?.bidAmount ?? defaultMatchAmount;
    }

    // ✅ Deduplication: Check existing offer by this user
    const [existing] = await db
      .select({ bidAmount: bids.bidAmount })
      .from(bids)
      .where(
        and(
          eq(bids.listingId, listing_id),
          eq(bids.userUuid, user_uuid),
          eq(bids.type, bid_type)
        )
      )
      .orderBy(desc(bids.bidAmount))
      .limit(1);

    if (existing && bid_amount <= existing.bidAmount) {
      return NextResponse.json(
        {
          error: `Your offer must be higher than your previous one ($${existing.bidAmount})`,
        },
        { status: 400 }
      );
    }

    // ✅ Insert offer
    const result = await db.insert(bids).values({
      listingId: listing_id,
      bidAmount: bid_amount,
      type: bid_type,
      userUuid: user_uuid,
    });

    return NextResponse.json({
      success: true,
      matchedAmount: bid_amount,
      result,
    });
  } catch (error) {
    console.error("❌ Error submitting offer:", error);
    return NextResponse.json(
      { error: "Failed to submit offer." },
      { status: 500 }
    );
  }
}
