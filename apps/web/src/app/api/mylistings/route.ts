// import { NextResponse } from "next/server";
// import { db } from "@/libs/db/drizzle";
// import { listings } from "@/libs/db/schema";
// import { auth0 } from "@/libs/auth0";
// import { headers } from "next/headers";

// export async function GET() {
//     try {
//       /*
//       // ✅ Get user session (Comment this out for testing)
//       const session = await auth0.getSession(headers());
  
//       if (!session || !session.user) {
//         console.error("❌ No session found. Returning Unauthorized.");
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//       }
//       const userUuid = session.user.sub; // ✅ Extract Auth0 user UUID
//       */
  
//       // ⚠️ Temporarily Hardcoded UUID (Uncomment this for testing)
//       const userUuid = "auth0|67d91134f8221c2f7344d9de"; // Replace this with an actual UUID from DB
  
//       console.log("✅ Fetching listings for User:", userUuid);
  
//       // ✅ Fetch user's listings from database
//       const userListings = await db
//         .select()
//         .from(listings)
//         .where(listings.userUuid.equals(userUuid));
  
//       console.log("📄 Retrieved Listings:", userListings);
  
//       return NextResponse.json(userListings, { status: 200 });
//     } catch (error) {
//       console.error("❌ Error fetching listings:", error);
//       return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
//   }
  

import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
// import { auth0 } from "@/libs/auth0"; // ❌ Comment out Auth0 temporarily
import { headers } from "next/headers";
import { eq } from "drizzle-orm"; // ✅ Import eq() for filtering

export async function GET() {
  try {
    // ❌ Comment out authentication for now
    // const session = await auth0.getSession(headers());

    // if (!session || !session.user) {
    //   console.error("❌ No session found. Returning Unauthorized.");
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // ✅ Temporarily hardcoded user UUID
    const userUuid = "auth0|67d91134f8221c2f7344d9de"; 
    console.log("✅ Fetching listings for User:", userUuid);

    // ✅ Query listings for the hardcoded user
    const userListings = await db
      .select()
      .from(listings)
      .where(eq(listings.userUuid, userUuid)); // ✅ Corrected filter

    console.log("📄 Retrieved Listings:", userListings);

    return NextResponse.json(userListings, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
