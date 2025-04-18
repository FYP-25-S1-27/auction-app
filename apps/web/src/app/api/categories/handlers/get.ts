import { NextRequest, NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listingCategory } from "@/libs/db/schema";
import { asc } from "drizzle-orm";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function handleGet(request: NextRequest) {
  try {
    const items = await db
      .select()
      .from(listingCategory)
      .orderBy(asc(listingCategory.name));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
