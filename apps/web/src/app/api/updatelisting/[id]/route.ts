import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listingId = parseInt(id);
    if (isNaN(listingId)) {
      return NextResponse.json(
        { error: "Invalid listing ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, category, description, starting_price, end_time } = body;

    console.log("📝 Updating listing:", { listingId, ...body });

    // ✅ Ensure listing exists before updating
    const existingListing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId));

    if (!existingListing.length) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // ✅ Perform the update
    await db
      .update(listings)
      .set({
        name,
        category,
        description,
        starting_price: Number(starting_price), // Ensure number
        end_time, // Ensure valid date
      })
      .where(eq(listings.id, listingId));

    console.log("✅ Listing updated successfully!");

    return NextResponse.json(
      { message: "Listing updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating listing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
