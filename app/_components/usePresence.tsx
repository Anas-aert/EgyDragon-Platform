"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function usePresence() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    // ✅ تحديث الحالة أونلاين
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

    // ✅ تحديث الحالة أوفلاين باستخدام sendBeacon عند غلق الصفحة
    const setOffline = () => {
      const payload = JSON.stringify({ userId, isOnline: false });
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/getStates", blob);
    };

    // أول ما يدخل المستخدم
    setOnline();

    // تحديث الـ lastSeen كل 30 ثانية
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
