"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const LoadingIndicator = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    NProgress.start();
    // وقف بعد فترة بسيطة عشان يبان الـ progress
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
};

export default LoadingIndicator;
