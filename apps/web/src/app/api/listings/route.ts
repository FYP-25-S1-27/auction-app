import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { auth0 } from "@/libs/auth0";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    // ✅ Get user session
    const session = await auth0.getSession(headers());

    let userUuid: string | null = null;

    if (session && session.user) {
      userUuid = session.user.sub;
    } else {
      console.warn("⚠️ No session found, using hardcoded userUuid for testing.");
      userUuid = "auth0|67d91134f8221c2f7344d9de"; // Replace this with a real UUID
    }

    console.log("✅ User UUID:", userUuid);

    // ✅ Parse JSON body
    const formData = await req.json();
    const { name, category, description, startingPrice, endTime, scheduled } = formData;

    console.log("📩 Received Data:", formData);
    console.log("🔍 Type of endTime from form:", typeof endTime, "| Value:", endTime);

    // ✅ Validate required fields
    if (!userUuid || !name || !category || !startingPrice || !endTime) {
      console.error("❌ Missing required fields:", { userUuid, name, category, startingPrice, endTime });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Ensure `endTime` is a valid Date
    let endTimeDate = new Date(endTime);
    console.log("🕒 Parsed endTime as Date:", endTimeDate);
    console.log("📅 Converted endTime to ISO:", endTimeDate.toISOString());

    if (isNaN(endTimeDate.getTime())) {
      console.error("❌ Invalid date format:", endTime);
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // ✅ Insert into the database
    await db.insert(listings).values({
      userUuid, 
      name,    
      category,
      description,
      startingPrice: Number(startingPrice), // Ensure it's a number
      endTime: endTimeDate, // ✅ Store as a proper Date object
      scheduled,
    });

    console.log("✅ Listing created successfully!");

    return NextResponse.json({ message: "Listing created successfully!" }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating listing:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
