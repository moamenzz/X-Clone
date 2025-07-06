import express from "express";
import {
  getAllChatHeads,
  getChatHistory,
  handleDeleteMessage,
  handleSendMessage,
  hideChat,
  unhideChat,
} from "../controllers/messageController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const messageRouter = express.Router();

messageRouter.get("/", verifyJWT, getAllChatHeads);
messageRouter.get("/:recipientId", verifyJWT, getChatHistory);
messageRouter.post("/:recipientId", verifyJWT, handleSendMessage);
messageRouter.put("/:userId/hide", verifyJWT, hideChat);
messageRouter.put("/:userId/unhide", verifyJWT, unhideChat);
messageRouter.delete("/", verifyJWT, handleDeleteMessage);

export default messageRouter;
