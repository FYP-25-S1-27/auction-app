import { db } from "@/libs/db/drizzle";
import { requests } from "@/libs/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Await the promise to get the actual params
  const requestId = parseInt(id);
  if (isNaN(requestId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const request = await db
    .select()
    .from(requests)
    .where(eq(requests.id, requestId));
  if (!request.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(request[0]);
}
