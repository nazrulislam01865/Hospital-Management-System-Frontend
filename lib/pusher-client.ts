"use client";

import Pusher from "pusher-js";
import { API_BASE_URL } from "@/lib/api";
import { getStoredToken } from "@/lib/auth-storage";

let pusherClient: Pusher | null = null;

export function getPusherClient() {
  if (typeof window === "undefined") {
    return null;
  }

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    console.warn(
      "Pusher frontend is disabled. Missing NEXT_PUBLIC_PUSHER_KEY or NEXT_PUBLIC_PUSHER_CLUSTER."
    );
    return null;
  }

  if (pusherClient) {
    return pusherClient;
  }

  pusherClient = new Pusher(key, {
    cluster,
    forceTLS: true,
    channelAuthorization: {
      endpoint: `${API_BASE_URL}/admin/notifications/pusher/auth`,
      transport: "ajax",
      headersProvider: () => {
        const token = getStoredToken();

        return token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};
      },
    },
  });

  return pusherClient;
}