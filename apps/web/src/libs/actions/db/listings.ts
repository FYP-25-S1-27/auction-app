"use server";

import { db } from "@/libs/db/drizzle";
import { listings, users } from "@/libs/db/schema";
import { ListingStatus } from "@/libs/types/listings";
import { eq } from "drizzle-orm";

export async function setListingStatus(id: number, status: ListingStatus) {
  await db.update(listings).set({ status: status }).where(eq(listings.id, id));
}

export async function deleteListing(id: number) {
  await db.delete(listings).where(eq(listings.id, id));
}

export async function getListing(id?: number) {
  let result;
  if (!id) {
    result = await db.select().from(listings);
  } else {
    result = await db.select().from(listings).where(eq(listings.id, id));
  }

  return result;
}
export async function getListingLeftJoinUser(id?: number) {
  let result;
  if (!id) {
    result = await db
      .select()
      .from(listings)
      .leftJoin(users, eq(listings.userUuid, users.uuid));
  } else {
    result = await db
      .select()
      .from(listings)
      .where(eq(listings.id, id))
      .leftJoin(users, eq(listings.userUuid, users.uuid));
  }

  return result;
}
