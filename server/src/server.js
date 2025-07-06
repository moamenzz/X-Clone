import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectMONGODB from "./lib/ConnectDB.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsConfig } from "./lib/corsConfig.js";
import postRouter from "./routes/postRouter.js";
import notificationRouter from "./routes/notificationRoute.js";
import messageRouter from "./routes/messageRouter.js";
import { app, server } from "./lib/socketIoInstance.js";

// const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors(corsConfig));

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/notifications", notificationRouter);
app.use("/messages", messageRouter);
app.use("/users", userRouter);

// app.listen(PORT, () => {
//   console.log(`Server running on port: ${PORT}`);
//   connectMONGODB();
// });

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  connectMONGODB();
});
