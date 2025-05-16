import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { requests } from "@/libs/db/schema";
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

    // ✅ Query requests for the user
    const userRequests = await db
      .select()
      .from(requests)
      .where(eq(requests.userUuid, user_uuid));

    console.log("📄 Retrieved Requests:", userRequests);

    return NextResponse.json(userRequests, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user requests:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
