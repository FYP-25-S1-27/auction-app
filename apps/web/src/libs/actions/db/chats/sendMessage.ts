"use server";

import { auth0 } from "@/libs/auth0";
import compareAndConcatIds from "./compareAndConcatIds";

const { db } = await import("@/libs/db/drizzle");
const { chatMessages } = await import("@/libs/db/schema");

export default async function sendMessage(
  conversationId: string,
  message: string,
  otherPartyUuid: string
) {
  const session = await auth0.getSession();
  if (!session) {
    return "Unauthorized";
  }

  const userUuid = session.user.sub;
  try {
    const conversationId = compareAndConcatIds(userUuid, otherPartyUuid);
    await db.insert(chatMessages).values({
      conversationId,
      senderUuid: userUuid,
      message,
    });
  } catch (error) {
    console.error("Error inserting message:", error);
    return "Error sending message";
  }
  return "Message sent";
}
