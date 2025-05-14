import { NextRequest } from "next/server";
import { db } from "@/libs/db/drizzle";
import { wallets } from "@/libs/db/schema";
import { eq } from "drizzle-orm";
import { auth0 } from "@/libs/auth0";

export async function GET() {
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

    return new Response(
      JSON.stringify({
        balance: wallet.balance,
        lastUpdated: wallet.lastUpdated,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching wallet:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
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
    const { amount, type = "topup" } = await req.json();
    if (isNaN(amount) || amount <= 0) {
      return new Response(
        JSON.stringify({ message: "Invalid amount to top up" }),
        { status: 400 }
      );
    }

    // Fetch the current wallet balance
    let existingwallet = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userUuid, user_uuid))
      .limit(1);

    if (existingwallet.length === 0) {
      // If no wallet exists, create a new one
      existingwallet = await db
        .insert(wallets)
        .values({
          userUuid: user_uuid,
          balance: 0,
          lastUpdated: new Date().toISOString(),
        })
        .returning();
    }

    const lastUpdated = new Date().toISOString();

    if (existingwallet.length === 0) {
      existingwallet = await db
        .insert(wallets)
        .values({
          userUuid: user_uuid,
          balance: 0,
          lastUpdated: new Date().toISOString(),
        })
        .returning();
    }

    const wallet = existingwallet[0];
    let newBalance: number;

    if (type === "withdraw") {
      if (wallet.balance < amount) {
        return new Response(
          JSON.stringify({ message: "Insufficient funds. Please try again." }),
          { status: 400 }
        );
      }
      newBalance = wallet.balance - amount;
    } else {
      newBalance = wallet.balance + amount;
    }

    await db
      .update(wallets)
      .set({
        balance: newBalance,
        lastUpdated,
      })
      .where(eq(wallets.userUuid, user_uuid));

    return new Response(
      JSON.stringify({
        balance: newBalance.toFixed(2),
        lastUpdated,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Wallet update error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
