import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeftRight, Bell, Check, MessageCircle, Star, Zap } from "lucide-react";
import { getApiError } from "../services/api";
import { notificationService } from "../services/notificationService";
import type { Notification } from "../services/types";

const TYPE_ICONS: Record<Notification["type"], ReactNode> = {
  request: <ArrowLeftRight className="w-4 h-4" />,
  match: <Zap className="w-4 h-4" />,
  accepted: <Check className="w-4 h-4" />,
  message: <MessageCircle className="w-4 h-4" />,
  system: <Star className="w-4 h-4" />,
};

const TYPE_COLORS: Record<Notification["type"], string> = {
  request: "bg-blue-50 text-blue-600",
  match: "bg-violet-50 text-violet-600",
  accepted: "bg-green-50 text-green-600",
  message: "bg-indigo-50 text-indigo-600",
  system: "bg-amber-50 text-amber-600",
};

function formatRelativeTime(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${Math.max(minutes, 1)} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } catch (loadError) {
        setError(getApiError(loadError, "Unable to load notifications."));
      }
    };

    void loadNotifications();
  }, []);

  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);
  const displayed = filter === "all" ? notifications : notifications.filter((notification) => !notification.read);

  const markAllRead = async () => {
    try {
      setError("");
      const updated = await notificationService.markAllRead();
      setNotifications(updated);
    } catch (updateError) {
      setError(getApiError(updateError, "Unable to update notifications."));
    }
  };

  const markRead = async (id: string) => {
    try {
      setError("");
      const updated = await notificationService.markRead(id);
      setNotifications((prev) => prev.map((notification) => (notification.id === id ? updated : notification)));
    } catch (updateError) {
      setError(getApiError(updateError, "Unable to update this notification."));
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-slate-900 mb-1" style={{ fontSize: "24px", fontWeight: 700 }}>
            Notifications
          </h1>
          <p className="text-slate-500" style={{ fontSize: "14px" }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => void markAllRead()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            style={{ fontSize: "13px" }}
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 mb-6" style={{ fontSize: "13px" }}>
          {error}
        </div>
      )}

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 rounded-lg transition-all ${
            filter === "all" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"
          }`}
          style={{ fontSize: "13px", fontWeight: filter === "all" ? 600 : 400 }}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-5 py-2 rounded-lg transition-all flex items-center gap-2 ${
            filter === "unread" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"
          }`}
          style={{ fontSize: "13px", fontWeight: filter === "unread" ? 600 : 400 }}
        >
          Unread
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center" style={{ fontSize: "10px" }}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-600" style={{ fontSize: "15px", fontWeight: 600 }}>
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </p>
          <p className="text-slate-400 mt-1" style={{ fontSize: "13px" }}>
            {filter === "unread"
              ? "You're all caught up for now."
              : "New requests, acceptances, and system updates will show up here."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((notification) => (
            <div
              key={notification.id}
              onClick={() => void markRead(notification.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                notification.read
                  ? "bg-white border-slate-100 hover:border-slate-200"
                  : "bg-indigo-50/40 border-indigo-100 hover:border-indigo-200"
              }`}
            >
              <div className="flex-shrink-0">
                {notification.avatar ? (
                  <div className="relative">
                    <img src={notification.avatar} alt="" className="w-11 h-11 rounded-xl object-cover" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${TYPE_COLORS[notification.type]}`}>
                      {TYPE_ICONS[notification.type]}
                    </div>
                  </div>
                ) : (
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${TYPE_COLORS[notification.type]}`}>
                    {TYPE_ICONS[notification.type]}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-slate-900" style={{ fontSize: "14px", fontWeight: notification.read ? 500 : 600 }}>
                    {notification.title}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-slate-400" style={{ fontSize: "11px" }}>{formatRelativeTime(notification.createdAt)}</span>
                    {!notification.read && <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />}
                  </div>
                </div>
                <p className="text-slate-500 mt-0.5" style={{ fontSize: "13px", lineHeight: "1.5" }}>
                  {notification.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
