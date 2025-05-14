"use client";

import { useState } from "react";
import { socket } from "../sio";
import { Alert, AlertTitle, Box } from "@mui/material";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import NextLink from "next/link";

export default function SocketMessageAlert() {
  const [message, setMessage] = useState<string | null>(null);
  socket.on("message", (data) => {
    setMessage(data);
  });
  if (!message) return null;
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        maxWidth: "400px",
        cursor: "pointer",
      }}
    >
      <NextLink href="/chats" onClick={() => setMessage(null)}>
        <Alert
          severity="info"
          onClose={() => setMessage(null)}
          sx={{
            boxShadow: 3,
            width: "100%",
            cursor: "pointer",
          }}
          iconMapping={{ info: <MarkUnreadChatAltIcon fontSize="inherit" /> }}
        >
          <AlertTitle>New Message</AlertTitle>
          {message}
        </Alert>
      </NextLink>
    </Box>
  );
}
