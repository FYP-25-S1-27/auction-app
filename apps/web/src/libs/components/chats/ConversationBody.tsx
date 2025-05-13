"use client";

import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useCallback, useEffect, useRef, useState } from "react";
import sendMessage from "@/libs/actions/db/chats/sendMessage";
import getChatMessages from "@/libs/actions/db/chats/getChatMessages";
import { InferSelectModel } from "drizzle-orm";
import { chatMessages } from "@/libs/db/schema";

interface ConversationBodyProps {
  conversationId: string;
  otherPartyUuid: string;
  // otherPartyUsername: string;
}

export default function ConversationBody({
  conversationId,
  otherPartyUuid,
}: // otherPartyUsername,
ConversationBodyProps) {
  const [message, setMessage] = useState<string>("");
  const [sendMessageStatus, setSendMessageStatus] =
    useState<Awaited<ReturnType<typeof sendMessage>>>();

  const [conversationStatus, setConversationStatus] =
    useState<Awaited<ReturnType<typeof getChatMessages>>>();
  const [conversationHistory, setConversationHistory] = useState<
    InferSelectModel<typeof chatMessages>[] | undefined
  >();

  const chatHistoryContainerRef = useRef<HTMLDivElement>(null);

  const _getChatMessages = useCallback(() => {
    getChatMessages(otherPartyUuid).then((messages) => {
      if (messages === "Unauthorized") {
        setConversationStatus(messages);
      } else {
        setConversationHistory(messages);
      }
    });
  }, [otherPartyUuid]);

  useEffect(() => {
    _getChatMessages();
  }, [_getChatMessages, conversationId, otherPartyUuid]);
  useEffect(() => {
    if (chatHistoryContainerRef.current) {
      chatHistoryContainerRef.current.scrollTop =
        chatHistoryContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]); // Scroll when messages change
  function handleSendMessage() {
    sendMessage(conversationId, message, otherPartyUuid).then((status) => {
      return setSendMessageStatus(status);
    });
    // Update the conversation history after sending a message
    _getChatMessages();
    // Clear the message input after sending
    setMessage("");
  }

  return (
    <Stack direction={"column"} spacing={2} sx={{ padding: 2 }}>
      {/* <Stack direction={"row"} justifyContent={"flex-start"} width={"100%"}>
        <Box bgcolor={"black"} height={10} width={10} />
      </Stack>

      <Stack direction={"row"} justifyContent={"flex-end"} width={"100%"}>
        <Box bgcolor={"black"} height={10} width={10} />
      </Stack> */}

      {/* Scrollable conversation history */}
      <Box
        ref={chatHistoryContainerRef}
        sx={{
          flex: 1, // Take remaining space
          overflowY: "auto", // Enable vertical scrolling
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
        {typeof conversationStatus === "string" && (
          <Typography variant="body1">{conversationStatus}</Typography>
        )}
        {Array.isArray(conversationHistory) &&
          conversationHistory.map((message) => (
            <Stack
              key={message.id}
              direction={"row"}
              justifyContent={
                message.senderUuid === otherPartyUuid
                  ? "flex-start"
                  : "flex-end"
              }
              width={"100%"}
            >
              <Typography
                variant="body1"
                border={"1px solid black"}
                padding={1}
                borderRadius={3}
                marginY={1}
              >
                {message.message}
              </Typography>
            </Stack>
          ))}
      </Box>
      <Stack direction={"column"}>
        {sendMessageStatus && (
          <Typography variant={"subtitle2"}>{sendMessageStatus}</Typography>
        )}
        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <TextField
            placeholder="Write a message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            aria-label="send message"
            onClick={handleSendMessage}
            disabled={!message}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
}
