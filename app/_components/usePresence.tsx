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

    // 🟢 أول ما يفتح
    updatePresence(true);

    // 🔴 لو خرج من الصفحة أو قفل التبويب
    const handleUnload = () => updatePresence(false);
    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        updatePresence(false);
      } else {
        updatePresence(true);
      }
    });

    // cleanup
    return () => {
      handleUnload(); // يحدث آخر مرة
      window.removeEventListener("beforeunload", handleUnload);
      channel.close();
    };
  }, [userId]);
}
