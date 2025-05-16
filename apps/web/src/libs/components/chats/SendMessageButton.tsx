"use client";
import compareAndConcatIds from "@/libs/actions/db/chats/compareAndConcatIds";
import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SendMessageButton({
  otherPartyUuid,
  prefilledMessage,
}: {
  otherPartyUuid: string;
  prefilledMessage?: string | null;
}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    async function initializeComponent() {
      if (user.user?.sub) {
        if (user.user.sub === otherPartyUuid) {
          setIsDisabled(true);
        }
        const convoId = compareAndConcatIds(user.user.sub, otherPartyUuid);
        setConversationId(convoId);
      }
    }
    initializeComponent();
  }, [user, otherPartyUuid]);

  async function handleClick() {
    if (!user.user?.sub) {
      router.push("/auth/login");
      return;
    }
    router.push(
      `/chats/${conversationId}${
        prefilledMessage ? `?prefilledMessage=${prefilledMessage}` : ""
      }`
    );
  }

  return (
    <Button
      sx={{ margin: 2 }}
      variant={"contained"}
      onClick={handleClick}
      disabled={isDisabled}
    >
      Send a message
    </Button>
  );
}
