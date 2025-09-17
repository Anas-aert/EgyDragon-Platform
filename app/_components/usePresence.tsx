"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export default function usePresence() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // ✅ ref عشان نضمن إن نفس القيمة بتستخدم داخل event handlers
  const userIdRef = useRef<string | null>(null);
  userIdRef.current = userId ?? null;

  useEffect(() => {
    if (!userId) return;

    let isUnmounted = false;

    const updatePresence = async (isOnline: boolean) => {
      try {
        // ✅ نستخدم ref علشان مايبقاش فيه stale closure
        if (!userIdRef.current) return;

        await fetch("https://egydragon-anas.vercel.app/api/getStates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userIdRef.current, isOnline }),
          keepalive: true, // ✅ مهم جدًا للـ beforeunload (يدعم إرسال request قبل إغلاق الصفحة)
        });
      } catch (err) {
        if (!isUnmounted) {
          console.error("Presence update failed:", err);
        }
      }
    };

    // أول دخول
    updatePresence(true);

    // تحديث كل 30 ثانية
    const interval = setInterval(() => {
      updatePresence(true);
    }, 30000);

    // عند غلق الصفحة / refresh
    const handleUnload = () => {
      updatePresence(false);
    };
    window.addEventListener("beforeunload", handleUnload);

    // cleanup
    return () => {
      isUnmounted = true;
      clearInterval(interval);
      updatePresence(false);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [userId]);
}
