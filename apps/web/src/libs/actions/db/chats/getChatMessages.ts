"use server";

import { db } from "@/libs/db/drizzle";
import { chatMessages } from "@/libs/db/schema";
import { asc, eq } from "drizzle-orm";
import compareAndConcatIds from "./compareAndConcatIds";
import { auth0 } from "@/libs/auth0";

export default async function getChatMessages(otherPartyUuid: string) {
  const session = await auth0.getSession();
  if (!session) {
    return "Unauthorized";
  }
  const userUuid = session.user.sub;
  const conversationId = compareAndConcatIds(userUuid, otherPartyUuid);
  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.conversationId, conversationId))
    .orderBy(asc(chatMessages.createdAt));
  return messages;
}
