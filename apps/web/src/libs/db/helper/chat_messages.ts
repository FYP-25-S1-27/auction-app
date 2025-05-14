import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import { chatMessages } from "../schema";
import compareAndConcatIds from "@/libs/actions/db/chats/compareAndConcatIds";

const COUNT = 200;

export async function seedChatMessages(userIds: string[]) {
  for (let i = 0; i < COUNT; i++) {
    const userId = faker.helpers.arrayElement(userIds);
    const userId2 = faker.helpers.arrayElement(
      userIds.filter((id) => id !== userId)
    );
    const conversationId = compareAndConcatIds(userId, userId2);
    const message = faker.lorem.sentence();

    try {
      await db.insert(chatMessages).values({
        conversationId,
        senderUuid: userId,
        message,
        createdAt: faker.date.recent({ days: 14 }).toISOString(),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Check if the error is a duplicate key error
      if (error.code === "23505") {
        // Duplicate key error, skip this iteration
        // console.warn("Duplicate key detected, skipping:", error.detail);
        continue;
      }
      // Log other errors
      console.error("Error inserting chat messages, retrying:", error);
    }
  }
}
