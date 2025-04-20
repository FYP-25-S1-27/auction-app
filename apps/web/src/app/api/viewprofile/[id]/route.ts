import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { users, userProfile } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = id;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await db
      .select()
      .from(users)
      .leftJoin(userProfile, eq(users.uuid, userProfile.userUuid))
      .where(eq(users.uuid, userId));

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = {
      ...user[0].users,
      ...user[0].user_profile,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
