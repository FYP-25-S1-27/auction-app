import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { requests } from "@/libs/db/schema"; // Make sure this matches your schema file
import { headers } from "next/headers";
import { auth0 } from "@/libs/auth0";

// 🟡 If you haven’t created a 'requests' table in your DB schema yet, I can help generate that too.

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession(headers());
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_uuid = session.user.sub;
    const { name, budget, description, category } = await req.json();

    if (!name || !budget || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRequest = await db
      .insert(requests)
      .values({
        user_uuid,
        name,
        budget,
        description,
        category,
      })
      .returning();

    return NextResponse.json(newRequest[0], { status: 201 });
  } catch (error) {
    console.error("❌ Error creating request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
