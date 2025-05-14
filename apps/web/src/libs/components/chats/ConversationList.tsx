import getConversationList from "@/libs/actions/db/chats/getConversationList";
import { getUser } from "@/libs/actions/db/users";
import { auth0 } from "@/libs/auth0";
// import { socket } from "@/libs/sio";
import { Stack, Typography } from "@mui/material";
import { formatRelative } from "date-fns";
import NextLink from "next/link";

export async function ConversationList() {
  const conversations = await getConversationList();
  const session = await auth0.getSession();
  if (!session) {
    return "Unauthorized";
  }
  const userUuid = session.user.sub;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // socket.on("message", (data) => {
  //   getConversationList().then((newConversations) => {
  //     conversations = newConversations;
  //   });
  // });

  return (
    <Stack direction={"column"} spacing={2} sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Conversations
      </Typography>
      {Array.isArray(conversations) && conversations.length === 0 ? (
        <>
          <Typography variant="body1" color="textSecondary">
            You have no conversations yet. Start a conversation with a seller or
            buyer to see it here.
          </Typography>
          <Typography variant="body1" color="textSecondary">
            To start a conversation, go to the listing page of an item you are
            interested in and click on the &quot;Chat&quot; button.
          </Typography>
        </>
      ) : (
        Array.isArray(conversations) &&
        conversations.map((conversation) => (
          <NextLink
            key={conversation.id}
            href={`/chats/${conversation.conversationId}`}
          >
            <Stack
              direction={"column"}
              spacing={2}
              sx={{
                padding: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                backgroundColor: "white",
              }}
            >
              <Stack
                direction={"row"}
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Typography variant="body1">
                  {conversation.senderUuid === userUuid
                    ? getUser(conversation.receiverUuid).then(
                        (user) => user[0]?.username || "Unknown User"
                      )
                    : getUser(conversation.senderUuid).then(
                        (user) => user[0]?.username || "Unknown User"
                      )}
                </Typography>
                <Typography
                  variant={"body2"}
                  color="textSecondary"
                  marginLeft={4}
                >
                  {formatRelative(conversation.createdAt, new Date())}
                </Typography>
              </Stack>
              <Typography variant="body2" color="textSecondary">
                {conversation.senderUuid === userUuid
                  ? "You"
                  : getUser(conversation.senderUuid).then(
                      (user) => user[0]?.username || "Unknown User"
                    )}
                : {conversation.message}
              </Typography>
            </Stack>
          </NextLink>
        ))
      )}
    </Stack>
  );
}
