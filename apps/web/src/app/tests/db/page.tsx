// import { users } from "@/lib/db/schema";
// import { db } from "@/lib/db/drizzle";
// import { connection } from "next/server";
// import { DrizzleError } from "drizzle-orm";

// export default async function Page() {
//   await connection(); // Make this page render on request https://nextjs.org/docs/app/api-reference/functions/connection
//   async function getUser() {
//     "use server";
//     try {
//       const user = await db.select().from(users).execute();
//       return user;
//     } catch (error) {
//       if (error instanceof DrizzleError) {
//         console.error("Error fetching users:", error);
//       }
//       return [];
//     }
//   }

//   const _users = await getUser();
//   return (
//     <div>
//       {_users
//         ? _users.map((u, index) => (
//             <div key={index}>
//               <h1>
//                 id: {u.uuid}, username: {u.username}
//               </h1>
//             </div>
//           ))
//         : null}
//     </div>
//   );
// }


import pool from "@/lib/db";

export async function GET() {
  console.log("API Hit: /api/endingsoon");  // ✅ Debug log
  try {
    const client = await pool.connect();
    console.log("Database Connected");  // ✅ Debug log
    
    const query = `
      SELECT id, name, description, "currentPrice", "endTime"
      FROM listings
      WHERE "endTime" <= NOW() + INTERVAL '1 day'
      ORDER BY "currentPrice" DESC
      LIMIT 40;
    `;
    console.log("Executing Query:", query);  // ✅ Debug log

    const result = await client.query(query);
    client.release();
    
    console.log("Query Success:", result.rows);  // ✅ Debug log
    return Response.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching 'ending soon' listings:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
