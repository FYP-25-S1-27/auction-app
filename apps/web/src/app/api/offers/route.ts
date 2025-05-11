import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { bids } from "@/libs/db/schema";
import { auth0 } from "@/libs/auth0";
import { eq, desc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listing_id, offer_price } = await req.json();

    if (!listing_id || !offer_price || offer_price <= 0) {
      return NextResponse.json(
        { error: "Invalid offer data" },
        { status: 400 }
      );
    }

    // ✅ Insert offer into the bids table
    const newOffer = await db
      .insert(bids)
      .values({
        listingId: listing_id,
        userUuid: session.user.sub,
        bidAmount: offer_price,
        type: "OFFER", // ✅ Important
      })
      .returning();

    console.log("✅ Offer placed:", newOffer[0]);

    return NextResponse.json(newOffer[0], { status: 201 });
  } catch (error) {
    console.error("❌ Error placing offer:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth0.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_uuid = session.user.sub;

    const offers = await db
      .select()
      .from(bids)
      .where(eq(bids.userUuid, user_uuid))
      .orderBy(desc(bids.bidTime));

    console.log("✅ Retrieved offers:", offers);

    return NextResponse.json(offers, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching offers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
