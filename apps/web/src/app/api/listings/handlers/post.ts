import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings, listingImages } from "@/libs/db/schema";
import { auth0 } from "@/libs/auth0";
import { sql } from "drizzle-orm";

export async function handlePost(req: Request) {
  try {
    // ✅ Get user session
    const session = await auth0.getSession();

    let user_uuid: string | null = null;

    if (session && session.user) {
      user_uuid = session.user.sub;
    } else {
      console.warn(
        "⚠️ No session found, using hardcoded user_uuid for testing."
      );
      user_uuid = "auth0|67d91134f8221c2f7344d9de";
    }

    console.log("✅ User UUID:", user_uuid);

    // ✅ Parse form data
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const starting_price = formData.get("starting_price") as string;
    const end_time = formData.get("end_time") as string | null;
    const start_time = formData.get("start_time") as string;
    const scheduled = formData.get("scheduled") as string;
    const image_urls = formData.getAll("image_urls") as string[];
    const type = (formData.get("type") as string)?.toUpperCase();

    console.log("📩 Received Data:", {
      name,
      category,
      description,
      starting_price,
      end_time,
      scheduled,
      start_time,
      type,
      image_urls: image_urls.map((f) => f),
    });

    // ✅ Validate required fields for both LISTING and REQUEST
    if (!user_uuid || !name || !category || !starting_price) {
      console.error("❌ Missing required fields:", {
        user_uuid,
        name,
        category,
        starting_price,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🚨 Validate end_time only for LISTING
    if (type !== "REQUEST" && !end_time) {
      console.error("❌ Missing end_time for LISTING:", { end_time });
      return NextResponse.json(
        { error: "end_time is required for listings" },
        { status: 400 }
      );
    }

    // ✅ Insert into the database
    const newListing = await db
      .insert(listings)
      .values({
        userUuid: user_uuid,
        name,
        category,
        description,
        startingPrice: Number(starting_price),
        endTime: end_time ?? sql`CURRENT_TIMESTAMP + interval '30 days'`,
        startTime: start_time ? start_time : sql`CURRENT_TIMESTAMP`,
        status: "ACTIVE",
        type: type === "REQUEST" ? "REQUEST" : "LISTING",
      })
      .returning({ id: listings.id });

    console.log(`✅ ${type} created successfully!`);

    // ✅ Only attach images if it's a listing
    if (type === "LISTING" && image_urls.length > 0) {
      for (const image_url of image_urls) {
        await db.insert(listingImages).values({
          listingId: newListing[0].id,
          imageUrl: image_url,
        });
      }
      console.log("Image URLs saved to listingImages");
    }

    return NextResponse.json(
      { message: `${type} created successfully!` },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating listing/request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
