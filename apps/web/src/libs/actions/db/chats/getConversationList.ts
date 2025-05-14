"use server";

import { auth0 } from "@/libs/auth0";
import { db } from "@/libs/db/drizzle";
import { chatMessages } from "@/libs/db/schema";
import { and, desc, eq, or, sql } from "drizzle-orm";

export default async function getConversationList() {
  const session = await auth0.getSession();
  if (!session) {
    return "Unauthorized";
  }
  const userUuid = session.user.sub;

  // First get the latest message id for each conversation
  const latestMessages = db
    .select({
      conversationId: chatMessages.conversationId,
      latestMessageId: sql<number>`MAX(${chatMessages.id})`.as(
        "latestMessageId"
      ),
    })
    .from(chatMessages)
    .where(
      or(
        eq(chatMessages.senderUuid, userUuid),
        eq(chatMessages.receiverUuid, userUuid)
      )
    )
    .groupBy(chatMessages.conversationId)
    .as("latestMessages");

  // Then get the full message details for these latest messages
  const conversations = await db
    .select({
      id: chatMessages.id,
      conversationId: chatMessages.conversationId,
      senderUuid: chatMessages.senderUuid,
      receiverUuid: chatMessages.receiverUuid,
      message: chatMessages.message,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .innerJoin(
      latestMessages,
      and(
        eq(chatMessages.id, latestMessages.latestMessageId),
        eq(chatMessages.conversationId, latestMessages.conversationId)
      )
    )
    .orderBy(desc(chatMessages.createdAt));

  return conversations;
}
