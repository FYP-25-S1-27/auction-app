// import pool from '@/lib/db'; // Ensure this is your PostgreSQL connection

// export async function GET() {
//   try {
//     const client = await pool.connect();
//     const query = `
//       SELECT id, name, description, "currentPrice", "endTime"
//       FROM listings
//       WHERE "endTime" <= NOW() + INTERVAL '1 day'
//       ORDER BY "currentPrice" DESC
//       LIMIT 40;
//     `;

//     // Query to fetch 40 listings ending in the next 24 hours, sorted by highest likes

//     // const query = `
//     // SELECT id, name, description, "currentPrice", "endTime", likes
//     // FROM listings
//     // WHERE "endTime" <= NOW() + INTERVAL '1 day'
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
