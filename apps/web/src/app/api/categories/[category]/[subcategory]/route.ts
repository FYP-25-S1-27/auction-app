import { db } from "@/libs/db/drizzle";
import { listingCategory, listings } from "@/libs/db/schema";
import { and, eq, lte, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; subcategory: string }> }
) {
  // No need for await - params is already an object
  const { category, subcategory } = await params;

  if (!category || !subcategory) {
    return NextResponse.json(
      { error: "Category or subcategory parameter missing" },
      { status: 400 }
    );
  }

  try {
    // Fetch the subcategory from the database
    const subcategoryData = await db
      .select()
      .from(listingCategory)
      .where(eq(listingCategory.name, subcategory.toUpperCase()))
      .limit(1);

    if (!subcategoryData.length) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    // Fetch listings + listing imgs for the subcategory
    const subcategoryListings = await db
      .select({
        id: listings.id,
        name: listings.name,
        description: listings.description,
        startingPrice: listings.startingPrice,
        currentPrice: listings.currentPrice,
        endTime: listings.endTime,
        status: listings.status,
        // imageUrl: listingImages.imageUrl, // Fetch the image URL directly
      })
      .from(listings)
      // .leftJoin(listingImages, eq(listingImages.listingId, listings.id)) // Join with listingImages
      .where(
        and(
          eq(listings.category, subcategory),
          lte(listings.startTime, sql`CURRENT_TIMESTAMP`)
        )
      );

    // Return the subcategory and its listings
    return NextResponse.json({
      name: subcategoryData[0].name,
      listings: subcategoryListings,
    });
  } catch (error) {
    console.error("[SUBCATEGORY_FETCH_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch subcategory data" },
      { status: 500 }
    );
  }
}
