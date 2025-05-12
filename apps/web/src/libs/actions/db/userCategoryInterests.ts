"use server";

import { db } from "@/libs/db/drizzle";
import { user_category_interests } from "@/libs/db/schema";
import { eq } from "drizzle-orm";

export async function getUserInterests(uuid: string) {
  const interests = await db
    .select({ categoryName: user_category_interests.categoryName })
    .from(user_category_interests)
    .where(eq(user_category_interests.userUuid, uuid));
  return interests;
}
