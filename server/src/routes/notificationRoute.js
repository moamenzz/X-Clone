import express from "express";
import {
  deleteNotifications,
  deleteSingleNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notificationController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const notificationRouter = express.Router();

notificationRouter.get("/", verifyJWT, getNotifications);
notificationRouter.put("/markAll-as-read/", verifyJWT, markAllAsRead);
notificationRouter.put("/mark-as-read/:notificationId", verifyJWT, markAsRead);
notificationRouter.delete(
  "/delete-notifications",
  verifyJWT,
  deleteNotifications
);
notificationRouter.delete(
  "/delete-notification/:notificationId",
  verifyJWT,
  deleteSingleNotification
);

export default notificationRouter;
