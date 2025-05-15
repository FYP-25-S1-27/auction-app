import { NextRequest, NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import {
  eq,
  and,
  gte,
  lte,
  ilike,
  SQL,
  desc,
  asc,
  sql,
  inArray,
} from "drizzle-orm";

export async function handleGet(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: SQL[] = [];
    let orderBy: SQL = desc(listings.createdAt);
    let pageSize: number = 20;
    let page: number = 1;

    searchParams.forEach((value, key) => {
      if (!value) return;

      switch (key) {
        case "page":
          page = parseInt(value);
          break;
        case "pageSize":
          pageSize = parseInt(value);
          break;
        case "category":
          const categories = value.split(",").map((cat) => cat.toUpperCase());
          if (categories.length > 0) {
            filters.push(inArray(listings.category, categories));
          }
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
          filters.push(
            inArray(
              listings.status,
              value.split(",").map((s) => s.toUpperCase())
            )
          );
          break;
        case "orderBy":
          if (value === "priceAsc") {
            orderBy = asc(listings.currentPrice);
          } else if (value === "priceDesc") {
            orderBy = desc(listings.currentPrice);
            // } else if (value === "createdAtAsc") {
            //   orderBy = asc(listings.createdAt);
            // } else if (value === "createdAtDesc") {
            //   orderBy = desc(listings.createdAt);
          } else if (value === "endTimeAsc") {
            orderBy = asc(listings.endTime);
          } else if (value === "endTimeDesc") {
            orderBy = desc(listings.endTime);
          }
          break;
        case "type":
          if (value === "REQUEST" || value === "LISTING") {
            filters.push(eq(listings.type, value));
          }
          break;
      }
    });

    const priceMetadata = await db
      .select({
        minPrice: sql`MIN(${listings.currentPrice || listings.startingPrice})`,
        maxPrice: sql`MAX(${listings.currentPrice || listings.startingPrice})`,
      })
      .from(listings)
      .where(
        searchParams.get("name")
          ? ilike(listings.name, `%${searchParams.get("name")}%`)
          : undefined
      )
      .limit(1);

    const minPrice = priceMetadata[0]?.minPrice || 0;
    const maxPrice = priceMetadata[0]?.maxPrice || 0;

    const items = await db
      .select()
      .from(listings)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(listings)
      .where(filters.length > 0 ? and(...filters) : undefined);

    const totalItems = Number(countResult[0].count);
    const totalPages = Math.ceil(totalItems / pageSize);

    return NextResponse.json({
      items,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
      metadata: {
        minPrice,
        maxPrice,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
