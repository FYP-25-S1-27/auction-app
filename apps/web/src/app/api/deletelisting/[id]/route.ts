import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listingId = parseInt(await id);
    if (isNaN(listingId)) {
      return NextResponse.json(
        { error: "Invalid listing ID" },
        { status: 400 }
      );
    }

    console.log("🗑️ Deleting listing with ID:", listingId);

    // ✅ Check if the listing exists
    const existingListing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId));

    if (!existingListing.length) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // ✅ Delete the listing
    await db.delete(listings).where(eq(listings.id, listingId));

    console.log("✅ Listing deleted successfully!");

    return NextResponse.json(
      { message: "Listing deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting listing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
