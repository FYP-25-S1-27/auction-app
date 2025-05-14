import getConversationList from "@/libs/actions/db/chats/getConversationList";
import { auth0 } from "@/libs/auth0";
import Footer from "@/libs/components/Footer";
import SocketMessageAlert from "@/libs/components/SocketMessageAlert";
import SocketProvider from "@/libs/components/SocketProvider";
import { Fragment } from "react";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();
  let conversationIds: string[] = [];
  if (session) {
    const conversationList = await getConversationList();
    if (typeof conversationList !== "string") {
      conversationIds = conversationList.map(
        (conversation) => conversation.conversationId
      );
      conversationIds.push(session?.user.sub); // Add user's own ID to receive new conversations
    }
  }
  return (
    <Fragment>
      {session && <SocketProvider conversationIds={conversationIds} />}
      <SocketMessageAlert />
      {children}
      <Footer />
    </Fragment>
  );
}
