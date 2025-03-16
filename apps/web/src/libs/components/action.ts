"use server";

import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { users } from "../db/schema";

export async function getRole(uuid: string) {
  const role = await db
    .select({ isAdmin: users.is_admin })
    .from(users)
    .where(eq(users.uuid, uuid));
  return role;
}
