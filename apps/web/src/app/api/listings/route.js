// import pool from '@/lib/db';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request) {
  return new Response("Hello, world!", { status: 200 });
}
// export async function GET() {
//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM listings ORDER BY "createdAt" DESC');
//     client.release();

//     return new Response(JSON.stringify(result.rows), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Database Error:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
