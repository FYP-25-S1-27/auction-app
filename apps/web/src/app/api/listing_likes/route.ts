import { db } from "@/libs/db/drizzle";
import { listingUserLikes, listings } from "@/libs/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth0 } from "@/libs/auth0";

// Fetch listing likes
export async function GET(req: Request) {
  const session = await auth0.getSession();
  const user = session?.user;
  const { searchParams } = new URL(req.url);
  const listingId = Number(searchParams.get("listingId"));

  if (!user) return NextResponse.json({ liked: false });

  if (listingId) {
    const liked = (
      await db
        .select()
        .from(listingUserLikes)
        .where(
          and(
            eq(listingUserLikes.userUuid, user.sub),
            eq(listingUserLikes.listingId, listingId)
          )
        )
    )[0];

    return NextResponse.json({ liked: !!liked });
  }
  // All listings liked by the user
  const userlikedListings = await db
    .select({
      id: listings.id,
      name: listings.name,
      category: listings.category,
      currentPrice: listings.currentPrice,
      startingPrice: listings.startingPrice,
      endTime: listings.endTime,
    })
    .from(listingUserLikes)
    .innerJoin(listings, eq(listings.id, listingUserLikes.listingId))
    .where(eq(listingUserLikes.userUuid, user.sub));

  return NextResponse.json(userlikedListings);
}

// Insert listing likes
export async function POST(req: Request) {
  const session = await auth0.getSession();
  let user_uuid: string | null = null;

  if (session && session.user) {
    user_uuid = session.user.sub;
  } else {
    return new Response("Unauthorized", { status: 401 });
  }

  const { listingId } = await req.json();

  await db.insert(listingUserLikes).values({
    userUuid: user_uuid,
    listingId,
  });

  return NextResponse.json({ success: true });
}

// Remove listing likes
export async function DELETE(req: Request) {
  const session = await auth0.getSession();
  let user_uuid: string | null = null;

  if (session && session.user) {
    user_uuid = session.user.sub;
  } else {
    return new Response("Unauthorized", { status: 401 });
  }

  const { listingId } = await req.json();

  await db
    .delete(listingUserLikes)
    .where(
      and(
        eq(listingUserLikes.userUuid, user_uuid),
        eq(listingUserLikes.listingId, listingId)
      )
    );

  return NextResponse.json({ success: true });
}
