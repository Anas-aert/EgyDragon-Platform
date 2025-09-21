"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdsenseScript() {
  const pathname = usePathname();

  const blockAdsenseRoutes = [
    "/settings",
    "/auth",
    "/login",
    "/providers",
    "/generated",
    "/lib",
  ];

  const showAdsense = !blockAdsenseRoutes.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    if (!showAdsense) return; // هنا بيتوقف خالص قبل إنشاء أي سكريبت

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4683128936517413";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [showAdsense]);

  return null;
}
