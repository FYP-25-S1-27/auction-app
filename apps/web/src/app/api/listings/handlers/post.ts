import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings, listingImages } from "@/libs/db/schema";
import { auth0 } from "@/libs/auth0";
import { promises as fs } from "fs";
import path from "path";

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
    }

    console.log("✅ User UUID:", user_uuid);

    // ✅ Parse form data
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const starting_price = formData.get("starting_price") as string;
    const end_time = formData.get("end_time") as string;
    const start_time = formData.get("start_time") as string;
    const scheduled = formData.get("scheduled") as string;
    const files: File[] = Array.from(formData.getAll("files") as File[]);

    console.log("📩 Received Data:", {
      name,
      category,
      description,
      starting_price,
      end_time,
      scheduled,
      start_time, // ADD 
      files: files.map((f) => f.name), // Log file names
    });

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

    // ✅ Insert into the database
    const newListing = await db
      .insert(listings)
      .values({
        userUuid: user_uuid,
        name,
        category,
        description,
        startingPrice: Number(starting_price), // Ensure it's a number
        endTime: end_time,
        startTime: start_time ? start_time : null, // ADD THIS LINE
        status: scheduled === 'true' ? "SCHEDULED" : "ACTIVE", // ADD THIS LINE
      })
      .returning({ id: listings.id });

    console.log("✅ Listing created successfully!");

    // File uploads and save image URLs
    const imageUrls: string[] = [];
    for (const file of files) {
      if (file instanceof File) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${user_uuid}-${file.name}`;
        const filePath = path.join(
          "/Applications/XAMPP/auction-app-main/apps/web/public/list_img/",
          filename
        );

        // Save the file 
        await fs.writeFile(filePath, buffer);

        // Image URL 
        const imageUrl = `${filename}`; 
        imageUrls.push(imageUrl);
      }
    }

    // ✅ Insert image URLs into listingImages table
    if (imageUrls.length > 0) {
      await db.insert(listingImages).values(
        imageUrls.map((url) => ({
          listingId: newListing[0].id,
          imageUrl: url,
        }))
      );
      console.log("Image URLs saved to listingImages");
    }

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