// import { NextResponse } from "next/server";
// import { db } from "@/libs/db/drizzle";
// import { users, userProfile } from "@/libs/db/schema";
// import { eq } from "drizzle-orm";

// export async function PUT(
//   req: Request,
//   // { params }: { params: Promise<{ id: string }> }
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id: userId } = params;

//     if (!userId || typeof userId !== "string") {
//       return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
//     }

//     const body = await req.json();

//     // this works
//     const { username } = body;
//     const { phone, address, age } = body;

//     console.log("📝 Updating user:", { userId, ...body });

//     // ✅ Ensure listing exists before updating
//     // this works
//     const existingListing = await db
//       .select()
//       .from(users)
//       .where(eq(users.uuid, userId));

//     // testing
//     // const existingListing = await db
//     //   .select()
//     //   .from(userProfile)
//     //   .where(eq(userProfile.userUuid, userId));

//     if (!existingListing.length) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // ✅ Perform the update
//     // await db
//     //   .update(listings)
//     //   .set({
//     //     name,
//     //     category,
//     //     description,
//     //     startingPrice: Number(starting_price), // Ensure number
//     //     endTime: end_time, // Ensure valid date
//     //   })
//     //   .where(eq(listings.id, listingId));

//     // this works
//     await db
//       .update(users)
//       .set({
//         username,
//       })
//       .where(eq(users.uuid, userId));

//       await db
//       .update(userProfile)
//       .set({
//         age: age ? parseInt(age) : null,
//         phone,
//         address,
//       })
//       .where(eq(userProfile.userUuid, userId));

//     // this works
//     // await db.insert(userProfile).values({
//     //   userUuid: userId,
//     //   age: age ? parseInt(age) : null,
//     //   phone,
//     //   address,
//     // });

//     // Check if profile exists
//     const existingProfile = await db
//       .select()
//       .from(userProfile)
//       .where(eq(userProfile.userUuid, userId));

//     if (existingProfile.length === 0) {
//       // If not exists, insert
//       await db.insert(userProfile).values({
//         userUuid: userId,
//         age: age ? parseInt(age) : null,
//         phone,
//         address,
//       });
//     }

//     console.log("✅ User profile updated successfully!");

//     return NextResponse.json(
//       { message: "User profile updated successfully!" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("❌ Error updating listing:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { users, userProfile } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = params;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await req.json();
    const { username, user_profile } = body;
    const { age, phone, address } = user_profile || {};

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

    if (Object.keys(updateData).length > 0) {
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
      { error: "Internal Server Error"},
      { status: 500 }
    );
  }
}
