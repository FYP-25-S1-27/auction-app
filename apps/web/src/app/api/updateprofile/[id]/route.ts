import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { users, userProfile } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await req.json();
    const { username, user_profile } = body;
    const { age, phone, address, gender } = user_profile || {};

    console.log("📝 Updating user:", { userId, username, age, phone, address });

    // Ensure user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.uuid, userId));

    if (!existingUser.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update `users` table
    if (username) {
      await db.update(users).set({ username }).where(eq(users.uuid, userId));
    }

    // Update `userProfile` table
    const updateData: Partial<typeof userProfile.$inferInsert> = {};
    if (age !== undefined) updateData.age = parseInt(age);
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (gender !== undefined) updateData.gender = gender;

    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
      await db
        .update(userProfile)
        .set(updateData)
        .where(eq(userProfile.userUuid, userId));
    }

    // Insert new profile if it doesn't exist
    const existingProfile = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userUuid, userId));

    if (existingProfile.length === 0) {
      await db.insert(userProfile).values({
        userUuid: userId,
        age: age ? parseInt(age) : null,
        phone: phone || null,
        address: address || null,
        gender: gender || null,
      });
    }

    console.log("✅ User profile updated successfully!");

    return NextResponse.json(
      { message: "User profile updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
