import Notification from "../models/notifications.model.js";

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.Id;
    const notifications = await Notification.find({ to: userId })
      .limit(limit)
      .skip(skip)
      .populate("from", "username img");

    res.status(200).json(notifications);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.Id;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};
export const deleteSingleNotification = async (req, res) => {
  try {
    const userId = req.Id;
    const notificationId = req.params.notificationId;

    const deletedNotification = await Notification.findByIdAndDelete({
      to: userId,
      _id: notificationId,
    });

    const remainingNotifications = await Notification.find({ to: userId });

    res.status(200).json(remainingNotifications);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};
export const markAsRead = async (req, res) => {
  try {
    const userId = req.Id;
    const notificationId = req.params.notificationId;

    const updatedNotification = await Notification.findByIdAndUpdate(
      { to: userId, _id: notificationId },
      { read: true },
      { new: true }
    );

    res.status(200).json(updatedNotification);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.Id;

    const UpdatedNotifications = await Notification.updateMany(
      { to: userId },
      { read: true },
      { new: true }
    );

    res.status(200).json(UpdatedNotifications);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server Error" });
  }
};
