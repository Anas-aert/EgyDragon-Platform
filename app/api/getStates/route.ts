"use client";

import { useEffect, useState } from "react";

type UserState = {
  id: string;
  isOnline: boolean;
  lastSeen: string;
};

export default function useUserState(userId: string) {
  const [state, setState] = useState<UserState | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchState = async () => {
      try {
        const res = await fetch(`/api/getStates?userId=${userId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch state");
        const data = await res.json();
        setState(data);
      } catch (err) {
        console.error("Error fetching user state:", err);
      }
    };

    // أول تحميل
    fetchState();

    // يحدث كل 10 ثواني
    const interval = setInterval(fetchState, 10_000);
    return () => clearInterval(interval);
  }, [userId]);

  return state;
}
