"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function usePresence() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const updatePresence = async () => {
      try {
        await fetch("/api/getStates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, lastSeen: new Date().toISOString() }),
        });
      } catch (err) {
        console.error("Failed to update presence:", err);
      }
    };

    // أول ما يدخل المستخدم
    updatePresence();

    // تحديث كل 30 ثانية
    const interval = setInterval(() => {
      updatePresence();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [userId]);
}
