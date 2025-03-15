"use client";
import { socket } from "@/lib/sio";
import { useEffect, useState } from "react";

export default function Page() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    socket.on("connect", () => {
      setMessage("Connected!");
    });
  }, []);

  function handleClick() {
    socket.connect();
  }
  function handleDisconnect() {
    socket.disconnect();
    setMessage("Disconnected!");
  }

  return (
    <div>
      <h1>{message}</h1>
      <button onClick={handleClick}>Connect</button>
      <button onClick={handleDisconnect}>Disconnect</button>
    </div>
  );
}
