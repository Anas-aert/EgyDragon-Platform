"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function usePresence() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const channel = new BroadcastChannel("presence");

    const updatePresence = async (isOnline: boolean) => {
      try {
        await fetch("/api/getStates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, isOnline }),
        });
        channel.postMessage({
          userId,
          isOnline,
          lastSeen: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to update presence:", err);
      }
    };

    // أول ما يدخل المستخدم → Online
    updatePresence(true);

    // تحديث كل 30 ثانية → يحافظ على Online
    const interval = setInterval(() => {
      updatePresence(true);
    }, 30_000);

    // لو قفل الصفحة → Offline
    const handleBeforeUnload = () => {
      navigator.sendBeacon(
        "/api/getStates",
        JSON.stringify({ userId, isOnline: false })
      );
      channel.postMessage({
        userId,
        isOnline: false,
        lastSeen: new Date().toISOString(),
      });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // تنظيف
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      updatePresence(false);
      channel.close();
    };
  }, [userId]);
}
