"use client";

import Script from "next/script";

export default function VignetteLoader() {
  return (
    <Script
      id="monetag-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(s){
          s.dataset.zone='9884440';
          s.src='https://groleegni.net/vignette.min.js';
        })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));`,
      }}
    />
  );
}
