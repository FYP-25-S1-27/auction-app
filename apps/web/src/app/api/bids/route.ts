import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/libs/auth0";
import { db } from "@/libs/db/drizzle";
import { bids, listings } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_uuid = user.sub;
    const { listing_id, bid_amount } = await req.json();

    console.log("📩 Received Bid Data:", { listing_id, bid_amount, user_uuid });

    if (!listing_id || !bid_amount || bid_amount <= 0) {
      return NextResponse.json({ error: "Invalid bid data" }, { status: 400 });
    }

    const listing = await db.select().from(listings).where(eq(listings.id, listing_id));

    if (!listing.length) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const current_price = listing[0].current_price || listing[0].starting_price;

    if (bid_amount <= current_price) {
      return NextResponse.json({ error: "Bid must be higher than current price" }, { status: 400 });
    }

    const newBid = await db
      .insert(bids)
      .values({ listing_id, user_uuid, bid_amount })
      .returning();

    await db
      .update(listings)
      .set({ current_price: bid_amount })
      .where(eq(listings.id, listing_id));

    return NextResponse.json(newBid[0], { status: 201 });
  } catch (error) {
    console.error("❌ Error placing bid:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
