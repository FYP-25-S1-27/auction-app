import { auth0 } from "@/libs/auth0";
import { NextRequest, NextResponse } from "next/server";

export async function handleGet(request: NextRequest): Promise<NextResponse> {
  try {
    const x = await auth0.getSession(request);
    console.log(x);
    return NextResponse.json(
      {
        message: "Hello from the get handler",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in auth0.getSession:", error);
    return NextResponse.json(
      {
        message: "An error occurred while processing the request.",
      },
      { status: 500 }
    );
  }
}
