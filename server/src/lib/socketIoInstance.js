import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

export const app = express();
export const server = createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:5173", "https://x-clone319.vercel.app"] },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("setup", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    io.emit("user-online", userId);
    console.log("User online: ", userId, socket.id);
  });

  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
    console.log("User joined chat: ", chatId);
  });

  socket.on("new-message", (message) => {
    const recipientSocket = onlineUsers.get(message.recipient);

    if (!message.sender) return;

    socket.to(recipientSocket).emit("message-received", message);
    socket.to(recipientSocket).emit("update-chat-heads");
  });

  socket.on("delete-message", ({ messageId, recipientId }) => {
    socket.to(recipientId).emit("deleted-message", messageId);
  });

  socket.on("typing", (room) => socket.to(room).emit("typing"));
  socket.on("stop-typing", (room) => socket.to(room).emit("stop-typing"));

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socketId.id) {
        onlineUsers.delete(userId);
        io.emit("user-offline", userId);
        console.log("User disconnected: ", userId);
        break;
      }
    }
  });
});
