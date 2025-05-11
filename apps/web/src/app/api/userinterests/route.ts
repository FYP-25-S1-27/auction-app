import { db } from "@/libs/db/drizzle";
import { user_category_interests } from "@/libs/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

// Fetch user interests
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userUuid = searchParams.get("userUuid");

  if (!userUuid) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const interests = await db
      .select({ categoryName: user_category_interests.categoryName })
      .from(user_category_interests)
      .where(eq(user_category_interests.userUuid, userUuid));

    const categoryNames = interests.map((interest) => interest.categoryName);

    return NextResponse.json(categoryNames);
  } catch (error) {
    console.error("Error fetching user interests:", error);
    return NextResponse.json(
      { error: "Failed to fetch user interests" },
      { status: 500 }
    );
  }
}

// Add new interests
export async function POST(request: Request) {
  try {
    const { userUuid, interests } = await request.json();

    // Validate the request data
    if (!userUuid || !Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const insertData = interests.map((categoryName: string) => ({
      userUuid,
      categoryName,
    }));

    await db
      .insert(user_category_interests)
      .values(insertData)
      .onConflictDoNothing();

    return NextResponse.json(
      { message: "Interests added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding interests:", error);
    return NextResponse.json(
      { error: "Failed to add interests" },
      { status: 500 }
    );
  }
}

// Remove an interest
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userUuid = searchParams.get("userUuid");
  const interest = searchParams.get("interest");

  if (!userUuid || !interest) {
    return NextResponse.json(
      { error: "Missing userUuid or interest" },
      { status: 400 }
    );
  }

  try {
    // Delete interest from database
    await db
      .delete(user_category_interests)
      .where(
        and(
          eq(user_category_interests.userUuid, userUuid),
          eq(user_category_interests.categoryName, interest)
        )
      );

    return NextResponse.json({ message: "Interest deleted successfully" });
  } catch (error) {
    console.error("Error deleting interest:", error);
    return NextResponse.json(
      { error: "Failed to delete interest" },
      { status: 500 }
    );
  }
}
