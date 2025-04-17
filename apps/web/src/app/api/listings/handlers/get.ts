import { NextRequest, NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { and, eq, gte, lte, ilike, SQL, desc, asc } from "drizzle-orm";

export async function handleGet(request: NextRequest) {
  try {
    // Get all search params from the URL
    const searchParams = request.nextUrl.searchParams;
    const filters: SQL[] = [];
    let orderBy: SQL = desc(listings.createdAt); // Default order by createdAt descending
    let pageSize: number = 20; // Default page size
    let page: number = 1; // Default page number

    // Process each query parameter and build filters dynamically
    searchParams.forEach((value, key) => {
      // Default values to append if no params are provided
      if (!value) return;

      // Handle special cases for different column types
      switch (key) {
        case "page":
          page = parseInt(value);
          break;
        case "pageSize":
          pageSize = parseInt(value);
          break;
        case "category":
          filters.push(eq(listings.category, value.toUpperCase()));
          break;
        case "name":
          filters.push(ilike(listings.name, `%${value}%`));
          break;
        case "description":
          filters.push(ilike(listings.description, `%${value}%`));
          break;
        case "minPrice":
          filters.push(
            gte(
              listings.currentPrice || listings.startingPrice,
              parseInt(value)
            )
          );
          break;
        case "maxPrice":
          filters.push(
            lte(
              listings.currentPrice || listings.startingPrice,
              parseInt(value)
            )
          );
          break;
        case "status":
          filters.push(eq(listings.status, value));
          break;
        case "orderBy":
          // Handle ordering
          if (value === "priceAsc") {
            orderBy = asc(listings.currentPrice);
          } else if (value === "priceDesc") {
            orderBy = desc(listings.currentPrice);
          } else if (value === "createdAtAsc") {
            orderBy = asc(listings.createdAt);
          } else if (value === "createdAtDesc") {
            orderBy = desc(listings.createdAt);
          }
          break;
      }
    });

    // Execute the query with all applied filters
    const results = await db
      .select()
      .from(listings)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
