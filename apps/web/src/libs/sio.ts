import { io } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
if (!SOCKET_SERVER_URL || SOCKET_SERVER_URL === "") {
  throw new Error(
    "Missing NEXT_PUBLIC_BACKEND_BASE_URL (socket server) in environment variables"
  );
}

export const socket = io(SOCKET_SERVER_URL);
