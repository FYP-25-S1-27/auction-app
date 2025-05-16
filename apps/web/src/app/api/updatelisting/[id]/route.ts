import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings, listingImages } from "@/libs/db/schema";
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
    const {
      name,
      category,
      description,
      starting_price,
      end_time,
      start_time,
      image_url,
      status,
    } = body;

    console.log("📝 Updating listing:", { listingId, ...body });

    // ✅ Ensure listing exists before updating
    const existingListing = await db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId));

    if (!existingListing.length) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      name,
      category,
      description,
      startingPrice: Number(starting_price),
      endTime: end_time,
      status,
    };

    if (start_time && new Date(start_time) > new Date()) {
      updateData.startTime = start_time;
    }

    await db.update(listings).set(updateData).where(eq(listings.id, listingId));

    // Handle image URL update/insertion
    if (image_url) {
      // Check if image exists for listing
      const existingImage = await db
        .select()
        .from(listingImages)
        .where(eq(listingImages.listingId, listingId));

      if (existingImage.length) {
        // Update existing image record
        await db
          .update(listingImages)
          .set({ imageUrl: image_url })
          .where(eq(listingImages.listingId, listingId));
      } else {
        // Insert new image record
        await db
          .insert(listingImages)
          .values({ listingId, imageUrl: image_url });
      }
    }

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
