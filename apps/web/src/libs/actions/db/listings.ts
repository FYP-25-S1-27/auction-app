"use server";

import { db } from "@/libs/db/drizzle";
import { listings } from "@/libs/db/schema";
import { ListingStatus } from "@/libs/types/listings";
import { eq } from "drizzle-orm";

export async function setListingStatus(id: number, status: ListingStatus) {
  await db.update(listings).set({ status: status }).where(eq(listings.id, id));
}

export async function deleteListing(id: number) {
  await db.delete(listings).where(eq(listings.id, id));
}
