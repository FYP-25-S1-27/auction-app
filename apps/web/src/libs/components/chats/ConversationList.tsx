import getConversationList from "@/libs/actions/db/chats/getConversationList";
import { getUser } from "@/libs/actions/db/users";
import { auth0 } from "@/libs/auth0";
// import { socket } from "@/libs/sio";
import { Box, Stack, Typography } from "@mui/material";
import { formatRelative } from "date-fns";
import NextLink from "next/link";
import { connection } from "next/server";

export async function ConversationList() {
  await connection();
  const conversations = await getConversationList();
  // console.log(conversations)
  const session = await auth0.getSession();
  if (!session) {
    return "Unauthorized";
  }
  const userUuid = session.user.sub;
  // socket.on("message", (data) => {
  //   getConversationList().then((newConversations) => {
  //     conversations = newConversations;
  //   });
  let otherPartyUuid: string[] | null = null;
  if (typeof conversations === "string") {
    otherPartyUuid = null;
  } else {
    otherPartyUuid = conversations.map((conversation) =>
      conversation.conversationId.replace(userUuid, "")
    );
  }

  return (
    <Stack direction={"column"} spacing={2} sx={{ padding: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Conversations
      </Typography>
      <Box
        sx={{
          flex: 1, // Take remaining space
          overflowY: "auto", // Enable vertical scrolling
          minHeight: "60vh", // Minimum height to ensure it takes up some space
          maxHeight: "60vh", // Limit height to 60% of viewport height
          padding: 1,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
        }}
      >
        <Stack direction={"column"} spacing={2}>
          {Array.isArray(conversations) && conversations.length === 0 ? (
            <>
              <Typography variant="body1" color="textSecondary">
                You have no conversations yet. Start a conversation with a
                seller or buyer to see it here.
              </Typography>
              <Typography variant="body1" color="textSecondary">
                To start a conversation, go to the listing page of an item you
                are interested in and click on the &quot;Chat&quot; button.
              </Typography>
            </>
          ) : (
            Array.isArray(conversations) &&
            conversations.map((conversation, i) => (
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
                      {otherPartyUuid &&
                        getUser(otherPartyUuid[i]).then(
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
      </Box>
    </Stack>
  );
}
