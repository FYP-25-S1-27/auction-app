import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import sendMessage from "@/libs/actions/db/chats/sendMessage";
import compareAndConcatIds from "@/libs/actions/db/chats/compareAndConcatIds";

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  userUuid: string;
  otherPartyUuid: string;
  otherPartyUuidUsername: string | null;
  preFilledMessage?: string;
}

const ChatModal: React.FC<ChatModalProps> = ({
  open,
  onClose,
  userUuid,
  otherPartyUuid,
  otherPartyUuidUsername,
  preFilledMessage,
}) => {
  const [message, setMessage] = useState(preFilledMessage || "");
  const [sendMessageResult, setSendMessageResult] = useState<string | null>(
    null
  );

  const conversationId = compareAndConcatIds(userUuid, otherPartyUuid);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(conversationId, message, otherPartyUuid).then((result) => {
        setSendMessageResult(result);
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          Chat
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Say hi {otherPartyUuidUsername && `to ${otherPartyUuidUsername}`}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          sx={{ mb: 1 }}
        />
        {sendMessageResult && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {sendMessageResult}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Box>
    </Modal>
  );
};

export default ChatModal;
