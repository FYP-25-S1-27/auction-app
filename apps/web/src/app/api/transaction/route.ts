import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { listings, transactions, users } from  "@/libs/db/schema";
import { eq, or, aliasedTable } from "drizzle-orm";
import { auth0 } from "@/libs/auth0";

export async function GET(req: NextResponse) {
  try {
    // Get user session
    const session = await auth0.getSession();
    let user_uuid: string | null = null;

    if (session && session.user) {
      user_uuid = session.user.sub;
    } else {
      return new Response("Unauthorized", { status: 401 });
    }

    const buyer = aliasedTable(users, "buyer");
    const seller = aliasedTable(users, "seller");

    const results = await db
    .select({
      id: transactions.id,
      listingId: transactions.listingId,
      salePrice: transactions.salePrice,
      transactionDate: transactions.transactionDate,
      listingName: listings.name,
      buyerUsername: buyer.username, 
      sellerUsername: seller.username,
    })
    .from(transactions)
    .where(
      or(
        eq(transactions.buyerUuid, user_uuid),
        eq(transactions.sellerUuid, user_uuid)
      )
    )
    .innerJoin(listings, eq(transactions.listingId, listings.id))
    .leftJoin(buyer, eq(transactions.buyerUuid, buyer.uuid))
    .leftJoin(seller, eq(transactions.sellerUuid, seller.uuid))
    .orderBy(transactions.transactionDate);

    // return new Response(JSON.stringify({ transactions: results }), { status: 200 });
    return Response.json({transactions: results });

  } catch (err) {
    console.error("Error fetching transactions:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
