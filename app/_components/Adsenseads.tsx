"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdsenseScript() {
  const pathname = usePathname();

  // الصفحات أو الملفات اللي عايز تمنع فيها AdSense
  const blockAdsenseRoutes = [
    "/settings",
    "/providers",
    "/lib",
    "/generated",
    "/auth",
    "/_components/Navbar",
    "/_components/PostActions",
    "/_components/precense",
    "/_components/usePresence",
  ];

  // التحقق لو الصفحة الحالية تبدأ بأي Route محظور
  const showAdsense = !blockAdsenseRoutes.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    if (!showAdsense) return;

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4683128936517413";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      if (script && document.head.contains(script)) {
        document.head.removeChild(script); // تنظيف عند تغيير الصفحة
      }
    };
  }, [showAdsense]);

  return null;
}
