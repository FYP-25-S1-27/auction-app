import db from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { type, page = 0 } = req.query; // Pagination for endingsoon

  try {
    let query = "";

    // ✅ Top Picks: Get the top 4 listings for each category, cycling through categories.
    if (type === "top_picks") {
      query = `
        WITH ranked AS (
          SELECT id, name, description, currentPrice, endTime, category, likes,
                 ROW_NUMBER() OVER (PARTITION BY category ORDER BY currentPrice DESC) as rank
          FROM listings WHERE is_active = true
        )
        SELECT * FROM ranked WHERE rank <= 4
        ORDER BY category
        OFFSET $1 LIMIT 4;
      `;
    }

    // ✅ Ending Soon: Get listings that are ending in 1 day or less, ordered by likes.
    else if (type === "ending_soon") {
      query = `
        SELECT id, name, description, currentPrice, endTime, category, likes
        FROM listings
        WHERE is_active = true AND endTime <= NOW() + INTERVAL '1 day'
        ORDER BY likes DESC
        LIMIT 40 OFFSET $1;
      `;
    }

    // ✅ You Might Also Like: Get top 10 listings with highest likes.
    else if (type === "you_might_also_like") {
      query = `
        SELECT id, name, description, currentPrice, endTime, category, likes
        FROM listings
        WHERE is_active = true
        ORDER BY likes DESC
        LIMIT 10;
      `;
    }

    else {
      return res.status(400).json({ message: "Invalid query type" });
    }

    const result = await db.query(query, [page * 4]); // Pagination for top picks
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
