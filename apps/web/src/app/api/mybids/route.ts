import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { bids, listings } from "@/libs/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth0 } from "@/libs/auth0";

export async function GET() {
  try {
    // Get user session
    const session = await auth0.getSession();
    let user_uuid: string | null = null;

    if (session && session.user) {
      user_uuid = session.user.sub;
    } else {
      return new Response("Unauthorized", { status: 401 });
    }

    // ✅ Query listings for the user
    const bidResults = await db
    .select({
      id: bids.id,
      listingname: listings.name,
      bidAmt: bids.bidAmount,
      bidTime: bids.bidTime,
      listingId: listings.id,
    })
    .from(bids)
    .innerJoin(listings, eq(bids.listingId, listings.id))
    .where(and(eq(bids.userUuid, user_uuid), eq(bids.type, 'BID')))
   .orderBy(desc(bids.bidTime))

    console.log("📄 Retrieved Listings:", bidResults);

    return NextResponse.json(bidResults, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
