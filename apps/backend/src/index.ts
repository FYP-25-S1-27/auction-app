import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
const PORT = 3001;
const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: process.env.APP_BASE_URL, // Replace with your frontend's URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

interface MessageData {
  conversationId: string;
  message: string;
}

interface JoinData {
  conversationIds: string[];
}

io.on("connection", (socket: Socket) => {
  // console.log("a user connected", socket.id);
  socket.on("join", (data: JoinData) => {
    if (data !== null) {
      socket.join(data.conversationIds);
      console.log(`User ${socket.id} joined rooms: ${data.conversationIds}`);
    }
  });
  socket.on("message", (data: MessageData) => {
    // console.log(data);
    if (data !== null) {
      console.log("message", data.message);
      socket.to(data.conversationId).emit("message", data.message);
    }
  });
});

console.log(`listening on *:${PORT}`);
httpServer.listen(PORT);
