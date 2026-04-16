import { Notification } from "../models/Notification.js";
import { formatNotification } from "../utils/formatters.js";

export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(notifications.map(formatNotification));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to load notifications." });
  }
}

export async function markNotificationRead(req, res) {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    notification.read = true;
    await notification.save();
    return res.json(formatNotification(notification));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to update notification." });
  }
}

export async function markAllNotificationsRead(req, res) {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(notifications.map(formatNotification));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to update notifications." });
  }
}
