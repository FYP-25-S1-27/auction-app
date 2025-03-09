import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as SIOServer } from "socket.io";
import { Server } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: SIOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export async function GET(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("Starting Socket.IO server...");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: { origin: "*" },
    });

    io.on("connect", (socket) => {
      console.log("socket connect", socket.id);
      socket.broadcast.emit("welcome", `Welcome ${socket.id}`);
      socket.on("disconnect", async () => {
        console.log("socket disconnect");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.IO server already running.");
  }

  res
    .status(200)
    .json({ success: true, message: "Socket.IO server is running" });
}
