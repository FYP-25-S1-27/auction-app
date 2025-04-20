import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listingCategory } from "@/libs/db/schema";
import { eq, isNull } from "drizzle-orm";

export async function GET() {
  try {
    // ✅ Query categories from the listing_category table (fetch only the main categories)
    const categories = await db
      .select()
      .from(listingCategory)
      .where(isNull(listingCategory.parent));

    // If you need only distinct categories (to avoid duplicates)
    // const uniqueCategories = [...new Set(categories.map(item => item.name))];

    // console.log("📄 Retrieved Categories:", uniqueCategories);

    // Fetch subcategories for each main category
    const uniqueCategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await db
          .select()
          .from(listingCategory)
          .where(eq(listingCategory.parent, category.name));

        return {
          name: category.name,
          subcategories: subcategories.map((sub) => sub.name),
        };
      })
    );

    return NextResponse.json(uniqueCategories, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
