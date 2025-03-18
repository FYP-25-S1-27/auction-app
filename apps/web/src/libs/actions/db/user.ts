"use server";

import { db } from "@/libs/db/drizzle";
import { users } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

// set user is_admin status
export async function setIsAdmin(uuid: string, isAdmin: boolean) {
  await db.update(users).set({ is_admin: isAdmin }).where(eq(users.uuid, uuid));
}
