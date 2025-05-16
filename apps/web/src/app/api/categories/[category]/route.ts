import { db } from "@/libs/db/drizzle";
import { listingCategory, listings } from "@/libs/db/schema";
import { and, eq, inArray, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  if (!category) {
    return NextResponse.json(
      { error: "Category parameter missing" },
      { status: 400 }
    );
  }

  try {
    // Normalize the category name to match the database format
    const normalizedCategory = category.toUpperCase();

    // Fetch the category from the database
    const categoryData = await db
      .select()
      .from(listingCategory)
      .where(eq(listingCategory.name, normalizedCategory))
      .limit(1);

    if (!categoryData.length) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Fetch subcategories for the category
    const subcategories = await db
      .select()
      .from(listingCategory)
      .where(eq(listingCategory.parent, normalizedCategory));

    // Get all category names (main category + subcategories)
    const categoryNames = [
      normalizedCategory,
      ...subcategories.map((sub) => sub.name),
    ];

    // Fetch listings + listing imgs for the main category and its subcategories
    const categoryListings = await db
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
      // .leftJoin(listingImages, eq(listingImages.listingId, listings.id))
      .where(
        and(
          inArray(listings.category, categoryNames),
          lte(listings.startTime, sql`CURRENT_TIMESTAMP`)
        )
      );

    // Return the category and its listings
    return NextResponse.json({
      name: categoryData[0].name,
      subcategories: subcategories.map((sub) => sub.name),
      listings: categoryListings,
    });
  } catch (error) {
    console.error("[CATEGORY_FETCH_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch category data" },
      { status: 500 }
    );
  }
}
