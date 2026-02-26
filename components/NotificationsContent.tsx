"use client";

import { CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface Notification {
  _id: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
}

interface Props {
  notifications: Notification[];
  unreadCount: number;

  showAlertForm: boolean;
  setShowAlertForm: (v: boolean) => void;

  keywords: string;
  setKeywords: (v: string) => void;

  location: string;
  setLocation: (v: string) => void;

  loadingAlert: boolean;

  handleCreateJobAlert: () => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
}

export default function NotificationsContent({
  notifications,
  unreadCount,
  showAlertForm,
  setShowAlertForm,
  keywords,
  setKeywords,
  location,
  setLocation,
  loadingAlert,
  handleCreateJobAlert,
  markAllAsRead,
  markAsRead,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-white">
      {/* JOB ALERT */}
      {!showAlertForm ? (
        <button
          className="w-full text-left text-blue-600 font-medium px-4 py-3 border-b bg-blue-50/30"
          onClick={() => setShowAlertForm(true)}
        >
          + Create Custom Job Alert
        </button>
      ) : (
        <div className="flex flex-col gap-2 px-4 py-3 border-b bg-gray-50">
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Keywords..."
            className="w-full border rounded px-2 py-1 text-sm"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location..."
            className="w-full border rounded px-2 py-1 text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              className="text-xs text-gray-500"
              onClick={() => setShowAlertForm(false)}
            >
              Cancel
            </button>
            <button
              className="text-xs font-bold text-blue-600"
              onClick={handleCreateJobAlert}
              disabled={loadingAlert}
            >
              {loadingAlert ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      {notifications.length > 0 && (
        <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50/50">
          <span className="text-xs font-semibold text-gray-500">Recent</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 flex items-center gap-1"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          )}
        </div>
      )}

      {/* LIST */}
      {notifications.length === 0 ? (
        <p className="p-10 text-center text-gray-500 text-sm">
          No notifications
        </p>
      ) : (
        <div className="flex-1 overflow-y-auto max-h-[400px]">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => {
                markAsRead(n._id);
                if (n.link) router.push(n.link);
              }}
              className={`px-4 py-4 border-b cursor-pointer hover:bg-gray-50 ${
                n.isRead ? "opacity-70" : "bg-sky-50/50"
              }`}
            >
              <div className="flex justify-between">
                <p
                  className={`text-sm ${
                    n.isRead ? "text-gray-600" : "font-bold"
                  }`}
                >
                  {n.title}
                </p>
                {!n.isRead && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}