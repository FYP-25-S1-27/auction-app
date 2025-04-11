import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params; // Await the promise to get the actual params
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid listing ID" },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching listing details for ID:", id);

    const listing = await db.select().from(listings).where(eq(listings.id, id));

    if (!listing.length) {
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
