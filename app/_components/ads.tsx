"use client"; // مهم في app directory
import { useEffect } from "react";

export default function VignetteLoader() {
  useEffect(() => {
    const s = document.createElement("script");
    s.dataset.zone = "9884440";
    s.src = "https://groleegni.net/vignette.min.js";
    s.async = true;
    document.body.appendChild(s);

    return () => {
      document.body.removeChild(s);
    };
  }, []);

  return null;
}
