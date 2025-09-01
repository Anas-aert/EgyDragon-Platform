"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);

  // استرجاع القيم من localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedNotifications = localStorage.getItem("notifications");

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }
    if (savedNotifications) {
      setNotifications(savedNotifications === "true");
    }
  }, []);

  // تبديل الثيم
  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);

    localStorage.setItem("theme", newTheme);
  }

  // تبديل الإشعارات
  function toggleNotifications() {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem("notifications", String(newValue));
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      <h1 className="text-3xl font-bold">⚙️ Settings</h1>

      {/* Theme */}
      <div className="flex items-center gap-4">
        <span className="text-lg">Theme:</span>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 cursor-pointer transition-all duration-1000 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          {theme === "light" ? "Switch to Dark" : "Switch to Light"}
        </button>
      </div>

      {/* Notifications */}
      <div className="flex items-center gap-4">
        <span className="text-lg">Notifications:</span>
        <button
          onClick={toggleNotifications}
          className={`px-4 py-2 rounded-lg ${
            notifications
              ? "bg-green-500 cursor-pointer transition-all duration-1000 hover:bg-green-600"
              : "bg-gray-500 cursor-pointer transition-all duration-1000 hover:bg-gray-600"
          } text-white`}
        >
          {notifications ? "Enabled ✅" : "Disabled ❌"}
        </button>
      </div>
    </div>
  );
}
