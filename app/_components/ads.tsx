"use client";
import { useEffect } from "react";

export default function VignetteLoader() {
  useEffect(() => {
    const script = document.createElement("script");
    script.id = "monetag-script";
    script.src = "https://magnificentmanlyyeast.com/0d/8c/2e/0d8c2e5a015a7a0d381cfdfea680d473.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
