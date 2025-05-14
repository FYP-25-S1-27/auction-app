"use client";

import { socket } from "@/libs/sio";
import { JoinData } from "@/libs/types/socketData";
import { useEffect } from "react";

interface SocketProviderProps {
  conversationIds: string[];
}

export default function SocketProvider({
  conversationIds,
}: SocketProviderProps) {
  useEffect(() => {
    const joinData: JoinData = {
      conversationIds,
    };
    socket.emit("join", joinData);

    return () => {
      socket.emit("leave", joinData);
    };
  }, [conversationIds]);

  return null;
}
