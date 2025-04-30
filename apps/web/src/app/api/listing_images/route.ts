import { db } from "@/libs/db/drizzle";
import { listingImages } from "@/libs/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const listingId = Number(searchParams.get("listingId"));

  const images = await db
    .select()
    .from(listingImages)
    .where(listingId ? eq(listingImages.listingId, listingId) : undefined);

  return NextResponse.json(images);
}
