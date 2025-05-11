import { NextResponse, NextRequest } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listingImages, listings, userProfile, users } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

type GetListingById = Awaited<ReturnType<typeof getListingById>>[0];
export type GetListingByIdWithImages = {
  image_urls: string[];
  shipping_fee?: number;
  delivery_estimate?: string;
} & GetListingById;

async function getListingById(id: string) {
  const listing = await db
    .select({
      id: listings.id,
      user_uuid: listings.userUuid,
      category: listings.category,
      name: listings.name,
      description: listings.description,
      starting_price: listings.startingPrice,
      current_price: listings.currentPrice,
      status: listings.status,
      end_time: listings.endTime,
      created_at: listings.createdAt,
      seller_name: users.username, // <- JOINED COLUMN ALIAS
      seller_bio: userProfile.bio,
    })
    .from(listings)
    .leftJoin(users, eq(users.uuid, listings.userUuid)) // JOIN users
    .leftJoin(userProfile, eq(userProfile.userUuid, listings.userUuid)) // JOIN userProfile
    .where(eq(listings.id, parseInt(id)));
  return listing;
}

async function getListingByWithImages(listing: GetListingById) {
  const images = await db
    .select({ imageUrl: listingImages.imageUrl })
    .from(listingImages)
    .where(eq(listingImages.listingId, listing.id));

  const listingWithImages = listing as GetListingByIdWithImages;
  listingWithImages.image_urls = images.map((image) => image.imageUrl);

  return listingWithImages;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("🔍 Fetching listing details for ID:", id);

    const _listing = await getListingById(id);
    if (!_listing.length) {
      console.log("❌ Listing not found for ID:", id);
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const listingWithImages = await getListingByWithImages(_listing[0]);

    console.log("📦 DB Result:", listingWithImages);

    return NextResponse.json(listingWithImages, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching listing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
