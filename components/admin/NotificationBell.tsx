"use client";

import Link from "next/link";
import { Bell, CheckCheck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getPusherClient } from "@/lib/pusher-client";
import { cn } from "@/lib/utils";

const ADMIN_NOTIFICATION_CHANNEL = "private-admin-notifications";
const ADMIN_NOTIFICATION_EVENT = "admin-notification";

export type AdminNotification = {
  id: string;
  type:
    | "PATIENT_CREATED"
    | "APPOINTMENT_CREATED"
    | "APPOINTMENT_UPDATED"
    | "APPOINTMENT_APPROVED"
    | "APPOINTMENT_CANCELLED"
    | "BILL_CREATED"
    | "BILL_PAID"
    | "ROOM_ASSIGNED"
    | "ROOM_RELEASED";
  title: string;
  message: string;
  href?: string;
  createdAt: string;
  entity?: {
    type: "patient" | "appointment" | "bill" | "room";
    id?: number;
  };
};

function formatNotificationTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString();
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const latestNotifications = useMemo(
    () => notifications.slice(0, 10),
    [notifications]
  );

  useEffect(() => {
    const pusher = getPusherClient();

    if (!pusher) {
      setConnectionError("Pusher is not configured.");
      return;
    }

    const channel = pusher.subscribe(ADMIN_NOTIFICATION_CHANNEL);

    const handleNotification = (notification: AdminNotification) => {
      setNotifications((previous) => {
        const alreadyExists = previous.some(
          (item) => item.id === notification.id
        );

        if (alreadyExists) {
          return previous;
        }

        return [notification, ...previous].slice(0, 30);
      });

      setUnreadCount((previous) => previous + 1);
    };

    const handleSubscriptionError = () => {
      setConnectionError("Notification connection failed.");
    };

    channel.bind(ADMIN_NOTIFICATION_EVENT, handleNotification);
    channel.bind("pusher:subscription_error", handleSubscriptionError);

    return () => {
      channel.unbind(ADMIN_NOTIFICATION_EVENT, handleNotification);
      channel.unbind("pusher:subscription_error", handleSubscriptionError);
      pusher.unsubscribe(ADMIN_NOTIFICATION_CHANNEL);
    };
  }, []);

  const handleToggle = () => {
    setOpen((previous) => !previous);

    if (!open) {
      setUnreadCount(0);
    }
  };

  const handleClear = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50",
          open && "bg-slate-50"
        )}
        aria-label="Open notifications"
      >
        <Bell size={18} />

        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-3 w-[22rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-slate-950">Notifications</p>
              <p className="text-xs text-slate-500">
                Realtime admin activity
              </p>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <CheckCheck size={14} />
              Clear
            </button>
          </div>

          {connectionError ? (
            <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
              {connectionError}
            </div>
          ) : null}

          <div className="max-h-96 overflow-y-auto">
            {latestNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  No notifications yet
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  New appointments, bills, and room updates will appear here.
                </p>
              </div>
            ) : (
              latestNotifications.map((notification) => {
                const content = (
                  <div className="block px-4 py-3 hover:bg-slate-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-[11px] font-medium text-slate-400">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>

                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                    </div>
                  </div>
                );

                return notification.href ? (
                  <Link
                    key={notification.id}
                    href={notification.href}
                    onClick={() => setOpen(false)}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>{content}</div>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <X size={14} />
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}