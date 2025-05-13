"use server";

import { db } from "@/libs/db/drizzle";
import { users } from "@/libs/db/schema";
import { randomInt } from "crypto";
import { eq } from "drizzle-orm";

// set user is_admin status
export async function setis_admin(uuid: string, is_admin: boolean) {
  await db.update(users).set({ isAdmin: is_admin }).where(eq(users.uuid, uuid));
}

export async function getRole(uuid: string) {
  const role = await db
    .select({ is_admin: users.isAdmin })
    .from(users)
    .where(eq(users.uuid, uuid));
  return role;
}

export async function getUser(uuid: string) {
  const user = await db.select().from(users).where(eq(users.uuid, uuid));
  return user;
}

export async function upsertUser(uuid: string, nickname: string) {
  await db
    .insert(users)
    .values({
      uuid,
      username: `${nickname}.${randomInt(9)}${randomInt(9)}`,
      isAdmin: false,
    })
    .onConflictDoNothing(); // ensures it won’t fail if user exists
}
