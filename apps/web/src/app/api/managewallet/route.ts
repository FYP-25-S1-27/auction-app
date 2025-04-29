import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { wallets } from  "@/libs/db/schema";
import { eq } from "drizzle-orm";
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

      const result = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userUuid, user_uuid))
      .limit(1);

    if (result.length === 0) {
      return new Response(JSON.stringify({ balance: "0.00" }), { status: 200 });
    }

    const wallet = result[0];

    return new Response(JSON.stringify({
      balance: wallet.balance,
      lastUpdated: wallet.lastUpdated
    }), { status: 200 });

  } catch (err) {
    console.error("Error fetching wallet:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function POST(req: NextResponse) {
    try {
      // Get user session
      const session = await auth0.getSession();
      let user_uuid: string | null = null;
  
      if (session && session.user) {
        user_uuid = session.user.sub;
      } else {
        return new Response("Unauthorized user", { status: 401 });
      }
  
      // Parse the amount to be topped up
      const { amount } = await req.json();
      if (isNaN(amount) || amount <= 0) {
        return new Response(
          JSON.stringify({ message: "Invalid amount to top up" }),
          { status: 400 }
        );
      }
  
      // Fetch the current wallet balance
      const existingwallet = await db
        .select()
        .from(wallets)
        .where(eq(wallets.userUuid, user_uuid))
        .limit(1);
  
      if (existingwallet.length === 0) {
        await db.insert(wallets).values({
            userUuid: user_uuid,
            balance: amount,
        });
      }
  
      const wallet = existingwallet[0];
  
      // Update the wallet balance
      const updatedBalance = parseFloat(wallet.balance) + amount;
      const lastUpdated = new Date().toISOString();
  
      const updatewallet = await db
        .update(wallets)
        .set({
          balance: updatedBalance.toString(),
          lastUpdated,
        })
        .where(eq(wallets.userUuid, user_uuid));
  
      if (updatewallet) {
        return new Response(
          JSON.stringify({
            balance: updatedBalance.toFixed(2),
            lastUpdated: new Date(),
          }),
          { status: 200 }
        );
      }
  
      return new Response(
        JSON.stringify({ message: "Failed to update wallet balance." }),
        { status: 500 }
      );
    } catch (err) {
      console.error("Error in wallet top up:", err);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }