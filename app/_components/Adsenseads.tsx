"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdsenseScript() {
  const pathname = usePathname();

  // الصفحات اللي عايز تمنع فيها AdSense
  const blockAdsenseRoutes = ["/settings", "/login", "/register"];
  const showAdsense = !blockAdsenseRoutes.includes(pathname);

  useEffect(() => {
    if (!showAdsense) return;

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4683128936517413";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script); // تنظيف عند تغيير الصفحة
    };
  }, [showAdsense]);

  return null;
}
