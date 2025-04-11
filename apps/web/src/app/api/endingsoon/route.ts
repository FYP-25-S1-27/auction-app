// import pool from '@/lib/db'; // Ensure this is your PostgreSQL connection

// export async function GET(request) {
//   return new Response("Hello, world!", { status: 200 });
// }
//   try {
//     const client = await pool.connect();
//     const query = `
//       SELECT id, name, description, "current_price", "end_time"
//       FROM listings
//       WHERE "end_time" <= NOW() + INTERVAL '1 day'
//       ORDER BY "current_price" DESC
//       LIMIT 40;
//     `;

//     // Query to fetch 40 listings ending in the next 24 hours, sorted by highest likes

//     // const query = `
//     // SELECT id, name, description, "current_price", "end_time", likes
//     // FROM listings
//     // WHERE "end_time" <= NOW() + INTERVAL '1 day'
//     // ORDER BY likes DESC
//     // LIMIT 40;
//     // `;
//     const result = await client.query(query);
//     client.release();

//     return Response.json(result.rows, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching 'ending soon' listings:", error);
//     return Response.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

import { db } from "@/libs/db/drizzle"; // Changed from lib to libs
import { listings } from "@/libs/db/schema"; // Changed from lib to libs
import { lt } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const endingSoonListings = await db
      .select()
      .from(listings)
      .where(lt(listings.endTime, new Date().toISOString()));

    return NextResponse.json(endingSoonListings, { status: 200 });
  } catch (error) {
    console.error("Error fetching ending soon listings:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
