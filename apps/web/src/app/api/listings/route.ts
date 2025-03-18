// import { NextResponse } from "next/server";
// import { db } from "@/libs/db/drizzle";
// import { listings } from "@/libs/db/schema";

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const category = formData.get("category") as string;
//     const description = formData.get("description") as string;
//     const startingPrice = Number(formData.get("startingPrice"));
//     const endTimeString = formData.get("endTime") as string;
//     const scheduled = formData.get("scheduled") === "true";

//     // ✅ Validate required fields
//     if (!category || !startingPrice || !endTimeString) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // ✅ Convert `endTime` to a Date object
//     const endTime = new Date(endTimeString);
//     if (isNaN(endTime.getTime())) {
//       return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
//     }

//     // ✅ Insert into the database
//     await db.insert(listings).values({
//       category,  // Ensure this exists in schema.ts
//       description,
//       startingPrice,
//       endTime,  // Store as Date object
//       scheduled,
//     });

//     return NextResponse.json({ message: "Listing created successfully!" }, { status: 201 });
//   } catch (error) {
//     console.error("Error creating listing:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json({ message: "Hello, world!" }, { status: 200 });
}
