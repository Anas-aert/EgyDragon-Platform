"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function usePresence() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    // ✅ تحديث الحالة لما يدخل
    const setOnline = async () => {
      try {
        await fetch("/api/getStates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, isOnline: true }),
        });
      } catch (err) {
        console.error("Failed to set online:", err);
      }
    };

    // ❌ تحديث الحالة لما يخرج
    const setOffline = async () => {
      try {
        await fetch("/api/getStates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, isOnline: false }),
        });
      } catch (err) {
        console.error("Failed to set offline:", err);
      }
    };

    // أول ما يدخل المستخدم
    setOnline();

    // يحدث الـ lastSeen كل 30 ثانية
    const interval = setInterval(() => {
      setOnline();
    }, 30000);

    // لما يقفل الصفحة أو يعمل refresh
    window.addEventListener("beforeunload", setOffline);

    return () => {
      clearInterval(interval);
      setOffline();
      window.removeEventListener("beforeunload", setOffline);
    };
  }, [userId]);
}
