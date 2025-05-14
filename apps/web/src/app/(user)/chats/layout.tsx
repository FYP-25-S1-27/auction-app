import { ConversationList } from "@/libs/components/chats/ConversationList";
import { Container, Stack } from "@mui/material";
import { connection } from "next/server";

export default async function ChatLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  await connection(); // make this page render on request
  return (
    <Container>
      <Stack direction={"row"}>
        <ConversationList />
        {children}
      </Stack>
    </Container>
  );
}
