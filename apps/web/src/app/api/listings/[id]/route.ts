import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings, users } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      console.log("❌ Invalid listing ID:", context.params.id);
      return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
    }

    console.log("🔍 Fetching listing details for ID:", id);

    const listing = await db
      .select({
        id: listings.id,
        user_uuid: listings.user_uuid,
        category: listings.category,
        name: listings.name,
        description: listings.description,
        starting_price: listings.starting_price,
        current_price: listings.current_price,
        status: listings.status,
        end_time: listings.end_time,
        created_at: listings.created_at,
        seller_name: users.username, // <- JOINED COLUMN ALIAS
      })
      .from(listings)
      .leftJoin(users, eq(users.uuid, listings.user_uuid)) // JOIN users
      .where(eq(listings.id, id));

    console.log("📦 DB Result:", listing);

    if (!listing.length) {
      console.log("❌ Listing not found for ID:", id);
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing[0], { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching listing:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
