"use client";

import usePresence from "./usePresence";

export default function PresenceManager() {
  usePresence();
  return null; // 👈 مش محتاج يرندر أي UI
}
