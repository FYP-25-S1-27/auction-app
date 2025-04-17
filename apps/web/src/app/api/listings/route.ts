import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { auth0 } from "@/libs/auth0";
import { handleGet } from "./handlers/get";

export const GET = handleGet;

export async function POST(req: Request) {
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
      user_uuid = "auth0|67d91134f8221c2f7344d9de"; // Replace this with a real UUID
    }

    console.log("✅ User UUID:", user_uuid);

    // ✅ Parse JSON body
    const formData = await req.json();
    const {
      name,
      category,
      description,
      starting_price,
      end_time /*, scheduled*/,
    } = formData;

    console.log("📩 Received Data:", formData);
    console.log(
      "🔍 Type of end_time from form:",
      typeof end_time,
      "| Value:",
      end_time
    );

    // ✅ Validate required fields
    if (!user_uuid || !name || !category || !starting_price || !end_time) {
      console.error("❌ Missing required fields:", {
        user_uuid,
        name,
        category,
        starting_price,
        end_time,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Ensure `end_time` is a valid Date
    // const end_timeDate = new Date(end_time);
    // console.log("🕒 Parsed end_time as Date:", end_timeDate);
    // console.log("📅 Converted end_time to ISO:", end_timeDate.toISOString());

    // if (isNaN(end_timeDate.getTime())) {
    //   console.error("❌ Invalid date format:", end_time);
    //   return NextResponse.json(
    //     { error: "Invalid date format" },
    //     { status: 400 }
    //   );
    // }

    // ✅ Insert into the database
    await db.insert(listings).values({
      userUuid: user_uuid,
      name,
      category,
      description,
      startingPrice: Number(starting_price), // Ensure it's a number
      endTime: end_time, // ✅ Store as a proper Date object
      //scheduled,
    });

    console.log("✅ Listing created successfully!");

    return NextResponse.json(
      { message: "Listing created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating listing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
