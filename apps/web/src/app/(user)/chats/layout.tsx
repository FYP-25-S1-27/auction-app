import { ConversationList } from "@/libs/components/chats/ConversationList";
import { Container, Stack } from "@mui/material";

export default async function ChatLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Container>
      <Stack direction={"row"}>
        <ConversationList />
        {children}
      </Stack>
    </Container>
  );
}
