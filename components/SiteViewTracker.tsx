"use client";

import { useEffect } from "react";

export default function SiteViewTracker() {
  useEffect(() => {
    const SESSION_KEY = "probashider_ovijog_view_session";

    let sessionId = sessionStorage.getItem(SESSION_KEY);

    if (!sessionId) {
      sessionId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      sessionStorage.setItem(SESSION_KEY, sessionId);
    }

    const sendHeartbeat = () => {
      fetch("/api/site-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
        }),
      }).catch((error) => {
        console.error("View tracking error:", error);
      });
    };

    // প্রথমবার সঙ্গে সঙ্গে পাঠাবে
    sendHeartbeat();

    // এরপর প্রতি ১ মিনিটে activity update করবে
    const interval = setInterval(() => {
      sendHeartbeat();
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
}
 