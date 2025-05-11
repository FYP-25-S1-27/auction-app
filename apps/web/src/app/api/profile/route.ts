import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { users, userProfile, user_category_interests } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { user_uuid } = await req.json();
    if (!user_uuid) {
      return NextResponse.json(
        { error: "No user ID provided" },
        { status: 400 }
      );
    }

    // ✅ Query user profile for the user
    const userUsers = await db
      .select()
      .from(users)
      .leftJoin(userProfile, eq(users.uuid, userProfile.userUuid))
      .where(eq(users.uuid, user_uuid)); // ✅ Corrected filter

    // Query user interests for the user
    const interests = await db
      .select({ name: user_category_interests.categoryName })
      .from(user_category_interests)
      .where(eq(user_category_interests.userUuid, user_uuid));

    const interestNames = interests.map((i) => i.name);

    return NextResponse.json({
      profile: userUsers,
      interests: interestNames,
    });
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
