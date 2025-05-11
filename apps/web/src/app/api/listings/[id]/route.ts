import { NextResponse, NextRequest } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings, users } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("🔍 Fetching listing details for ID:", id);

    const listing = await db
      .select({
        id: listings.id,
        user_uuid: listings.userUuid,
        category: listings.category,
        name: listings.name,
        description: listings.description,
        starting_price: listings.startingPrice,
        current_price: listings.currentPrice,
        status: listings.status,
        end_time: listings.endTime,
        created_at: listings.createdAt,
        seller_name: users.username, // <- JOINED COLUMN ALIAS
      })
      .from(listings)
      .leftJoin(users, eq(users.uuid, listings.userUuid)) // JOIN users
      .where(eq(listings.id, parseInt(id)));

    console.log("📦 DB Result:", listing);

    if (!listing.length) {
      console.log("❌ Listing not found for ID:", id);
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing[0], { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching listing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
