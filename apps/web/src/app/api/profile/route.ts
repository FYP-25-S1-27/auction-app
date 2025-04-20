import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { users, userProfile } from "@/libs/db/schema";
// import { auth0 } from "@/libs/auth0";
import { eq } from "drizzle-orm"; 

export async function GET() {
    try {

    // ✅ Temporarily hardcoded user UUID (#TODO)
    const user_uuid = "google-oauth2|101106278116232230288";
    console.log("✅ Fetching user id:", user_uuid);

    // ✅ Query listings for the hardcoded user
    const userUsers = await db
        .select()
        .from(users)
        .leftJoin(userProfile, eq(users.uuid, userProfile.userUuid))
        .where(eq(users.uuid, user_uuid)); // ✅ Corrected filter

    console.log("📄 Retrieved Users:", userUsers);

    return NextResponse.json(userUsers, { status: 200 });
    } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
    );
    }
}

// import { NextResponse } from "next/server";
// import { db } from "@/libs/db/drizzle";
// import { users } from "@/libs/db/schema";
// import { auth0 } from "@/libs/auth0";
// import { NextRequest } from "next/server";
// import { eq } from "drizzle-orm"; 

// export async function GET(req: NextRequest) {
//     try {
//       // ✅ Get user session (Comment this out for testing)
//       const session = await auth0.getSession(req);

//       if (!session || !session.user) {
//         console.error("❌ No session found. Returning Unauthorized.");
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//       }
//       const user_uuid = session.user.sub; // ✅ Extract Auth0 user UUID

//       // ✅ Fetch user's listings from database
//       const userListings = await db
//         .select({ username: users.username })  // Specify the fields you need
//         .from(users)
//         .where(eq(users.uuid, user_uuid));

//       console.log("📄 Retrieved Users:", userListings);

//       return NextResponse.json(userListings, { status: 200 });
//     } catch (error) {
//       console.error("❌ Error fetching listings:", error);
//       return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }