import { NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import { db } from "@/libs/db/drizzle";
import { users } from "@/libs/db/schema";

// This function is created as an api route because NextJS' treats its middleware as an edge function
// and thus cannot access the database without using their edge runtime compatible database client
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ isAdmin: false });
    }

    const user = await db.select().from(users).where(eq(users.uuid, userId));

    // if the user is not an admin, redirect to landing page
    if (user.length === 0 || !user[0].isAdmin) {
      return NextResponse.json({ isAdmin: false });
    }

    return NextResponse.json({ isAdmin: true });
  } catch (error) {
    throw error;
    if (error instanceof TypeError) {
      return NextResponse.json(
        {
          message: "An error occurred while processing the request.",
        },
        { status: 500 }
      );
    }
  }
}
