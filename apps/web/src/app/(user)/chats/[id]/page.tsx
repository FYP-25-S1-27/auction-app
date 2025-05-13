import { getUser } from "@/libs/actions/db/users";
import { auth0 } from "@/libs/auth0";
import ConversationBody from "@/libs/components/chats/ConversationBody";
import { Box, Stack, Typography } from "@mui/material";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversationId = id;
  const session = await auth0.getSession();
  if (!session) {
    return "Unauthorized";
  }
  // remove user's uuid from conversationId
  const userUuid = session.user.sub;
  // html encode userUuid
  const encodedUserUuid = encodeURIComponent(userUuid);
  const otherPartyUuid = decodeURIComponent(
    conversationId.replace(encodedUserUuid, "")
  );
  const otherPartyUser = await getUser(otherPartyUuid);
  if (!otherPartyUser) {
    return "User not found";
  }
  const otherPartyUsername = otherPartyUser[0]?.username || "Unknown User";

  return (
    <Stack direction={"column"} spacing={2} sx={{ padding: 2 }} width={"100%"}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        {otherPartyUsername}
      </Typography>
      <Box
        maxWidth={"80%"}
        sx={{
          padding: 2,
          border: "1px solid #ccc",
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <ConversationBody
          conversationId={conversationId}
          otherPartyUuid={otherPartyUuid}
        />
      </Box>
    </Stack>
  );
}
