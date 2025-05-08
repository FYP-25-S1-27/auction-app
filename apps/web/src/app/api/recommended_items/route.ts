import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const recommendedItems = await db
    .select()
    .from(listings)
    .orderBy(sql`RANDOM()`)
    .limit(20);

  return NextResponse.json(recommendedItems, {
    status: 200,
  });
}
