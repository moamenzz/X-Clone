import Notification from "../models/notifications.model.js";

const createNotification = async (fromUserId, toUserId, type) => {
  try {
    // Don't create notification if user is interacting with their own content
    if (fromUserId.toString() === toUserId.toString()) {
      return null;
    }

    const notification = new Notification({
      from: fromUserId,
      to: toUserId,
      type,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

export default createNotification;
