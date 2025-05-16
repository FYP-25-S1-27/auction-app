import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { requests } from "@/libs/db/schema";
import { auth0 } from "@/libs/auth0";

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();

    if (!session || !session.user?.sub) {
      console.error("❌ No user session found. Unauthorized request.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userUuid = session.user.sub;

    const { title, description, category } = await req.json();

    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required." },
        { status: 400 }
      );
    }

    const newRequest = await db
      .insert(requests)
      .values({
        title,
        description,
        category,
        userUuid,
      })
      .returning();

    console.log("✅ Request created:", newRequest[0]);
    return NextResponse.json(newRequest[0], { status: 201 });
  } catch (error) {
    console.error("❌ Error creating request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allRequests = await db.select().from(requests);
    return NextResponse.json(allRequests, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
