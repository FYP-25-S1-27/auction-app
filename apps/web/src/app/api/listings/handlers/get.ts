import { NextRequest, NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import {
  and,
  gte,
  lte,
  ilike,
  SQL,
  desc,
  asc,
  sql,
  inArray,
  eq,
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
          filters.push(inArray(listings.category, value.split(",")));
          break;
        case "name":
          filters.push(ilike(listings.name, `%${value}%`));
          break;
        case "description":
          filters.push(ilike(listings.description, `%${value}%`));
          break;
        case "minPrice":
          filters.push(gte(listings.currentPrice || listings.startingPrice, parseInt(value)));
          break;
        case "maxPrice":
          filters.push(lte(listings.currentPrice || listings.startingPrice, parseInt(value)));
          break;
        case "status":
          const statuses = value.split(",").map((s) => s.toUpperCase());
          let statusFilters: string[] = statuses;

          if (
            statuses.includes("ACTIVE") &&
            !statuses.includes("ENDED") &&
            !statuses.includes("SOLD")
          ) {
            filters.push(
              lte(sql`CURRENT_TIMESTAMP`, listings.endTime) // Exclude ended listings
            );
          }
          if (
            !statuses.includes("ACTIVE") &&
            statuses.includes("ENDED") &&
            !statuses.includes("SOLD")
          ) {
            filters.push(
              lte(listings.endTime, sql`CURRENT_TIMESTAMP`) // Include only ended listings
            );
            statusFilters = ["ACTIVE"]; // add back ACTIVE to the filter since there is no ENDED status in the DB
          }

          filters.push(
            inArray(
              listings.status,
              statusFilters.filter((s) => s !== "ENDED") // Exclude ENDED status from the filter (there is no ENDED status in the DB)
            )
          );
          break;
        case "orderBy":
          if (value === "priceAsc") orderBy = asc(listings.currentPrice);
          else if (value === "priceDesc") orderBy = desc(listings.currentPrice);
          else if (value === "endTimeAsc") orderBy = asc(listings.endTime);
          else if (value === "endTimeDesc") orderBy = desc(listings.endTime);
          break;
        case "listing_types":
        case "type":
          filters.push(eq(listings.type, value.toUpperCase() as "REQUEST" | "LISTING"));
          break;
        case "user_uuid":
          filters.push(eq(listings.userUuid, value));
          break;
      }
    });

    filters.push(lte(listings.startTime, sql`CURRENT_TIMESTAMP`));

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

    const priceMetadata = await db
      .select({
        minPrice: sql`MIN(${listings.currentPrice || listings.startingPrice})`,
        maxPrice: sql`MAX(${listings.currentPrice || listings.startingPrice})`,
      })
      .from(listings)
      .where(
        and(
          searchParams.get("name")
            ? ilike(listings.name, `%${searchParams.get("name")}%`)
            : undefined
        )
      )
      .limit(1);

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
        minPrice: priceMetadata[0]?.minPrice || 0,
        maxPrice: priceMetadata[0]?.maxPrice || 0,
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
