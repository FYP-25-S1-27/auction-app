import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { eq } from "drizzle-orm";
import { auth0 } from "@/libs/auth0";

export async function GET() {
  try {
    // Get user session
    const session = await auth0.getSession();
    let user_uuid: string | null = null;

    if (session && session.user) {
      user_uuid = session.user.sub;
    } else {
      return new Response("Unauthorized", { status: 401 });
    }

    // ✅ Query listings for the user
    const userListings = await db
      .select()
      .from(listings)
      .where(eq(listings.userUuid, user_uuid)); // ✅ Corrected filter

    console.log("📄 Retrieved Listings:", userListings);

    return NextResponse.json(userListings, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}