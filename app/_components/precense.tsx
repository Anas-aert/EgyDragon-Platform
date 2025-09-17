"use client";

import usePresence from "./usePresence";

export default function PresenceManager() {
  // ✅ Hook لازم يتنده هنا مباشرة
  usePresence();

  return null; // 👈 مفيش UI محتاج يتعرض
}
