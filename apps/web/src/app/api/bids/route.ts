import { NextResponse } from "next/server";
import { db } from "@/libs/db/drizzle";
import { bids, listings } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
      const user_uuid = "auth0|67d91134f8221c2f7344d9de"; // Hardcoded for testing
  
      const { listing_id, bid_amount } = await req.json();
      console.log("📩 Received Bid Data:", { listing_id, bid_amount, user_uuid });
  
      // Validate required fields
      if (!listing_id || !bid_amount || bid_amount <= 0) {
        console.log("❌ Invalid bid data!");
        return NextResponse.json({ error: "Invalid bid data" }, { status: 400 });
      }
  
      // Fetch listing details
      const listing = await db.select().from(listings).where(eq(listings.id, listing_id));
  
      console.log("🔍 Listing details:", listing);
  
      if (!listing.length) {
        console.log("❌ Listing not found!");
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }
  
      // Check if bid is higher than current price
      const current_price = listing[0].current_price || listing[0].starting_price;
      console.log("💰 Current Price:", current_price);
  
      if (bid_amount <= current_price) {
        console.log("❌ Bid must be higher than current price!");
        return NextResponse.json({ error: "Bid must be higher than current price" }, { status: 400 });
      }
  
      // Insert new bid
      const newBid = await db.insert(bids).values({ listing_id, user_uuid, bid_amount }).returning();
      console.log("✅ Bid placed successfully:", newBid[0]);
  
      // Update listing price
      await db.update(listings).set({ current_price: bid_amount }).where(eq(listings.id, listing_id));
  
      return NextResponse.json(newBid[0], { status: 201 });
    } catch (error) {
      console.error("❌ Error placing bid:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
  