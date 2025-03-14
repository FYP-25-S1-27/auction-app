import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
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

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
});

console.log(`listening on *:${PORT}`);
httpServer.listen(PORT);
