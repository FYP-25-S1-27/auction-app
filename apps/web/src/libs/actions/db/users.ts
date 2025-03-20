"use server";

import { db } from "@/libs/db/drizzle";
import { users } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

// set user is_admin status
export async function setIsAdmin(uuid: string, isAdmin: boolean) {
  await db.update(users).set({ isAdmin: isAdmin }).where(eq(users.uuid, uuid));
}

export async function getRole(uuid: string) {
  const role = await db
    .select({ isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.uuid, uuid));
  return role;
}

export async function getUser(uuid: string) {
  const user = await db.select().from(users).where(eq(users.uuid, uuid));
  return user;
}
