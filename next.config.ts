import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.googlesyndication.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      // إضافة نطاقات monetag
      { protocol: "https", hostname: "*.monetag.com" },
      { protocol: "https", hostname: "monetag.com" },
      // إضافة النطاقات الأخرى
      { protocol: "https", hostname: "groleegni.net" },
      { protocol: "https", hostname: "*.groleegni.net" },
      { protocol: "https", hostname: "vouphoanooque.net" },
      { protocol: "https", hostname: "*.vouphoanooque.net" },
      { protocol: "https", hostname: "tzegilo.com" },
      { protocol: "https", hostname: "*.tzegilo.com" },
      // إضافة النطاق الجديد من الخطأ
      { protocol: "https", hostname: "fleraprt.com" },
      { protocol: "https", hostname: "*.fleraprt.com" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              script-src 'self' 'unsafe-inline' 'unsafe-eval'
                https://*.vercel-insights.com
                https://pagead2.googlesyndication.com
                https://googleads.g.doubleclick.net
                https://tpc.googlesyndication.com
                https://ep2.adtrafficquality.google
                https://*.monetag.com
                https://groleegni.net
                https://*.groleegni.net
                https://vouphoanooque.net
                https://*.vouphoanooque.net
                https://tzegilo.com
                https://*.tzegilo.com
                https://fleraprt.com
                https://*.fleraprt.com;

              script-src-elem 'self' 'unsafe-inline' 'unsafe-eval'
                https://*.vercel-insights.com
                https://pagead2.googlesyndication.com
                https://googleads.g.doubleclick.net
                https://tpc.googlesyndication.com
                https://ep2.adtrafficquality.google
                https://*.monetag.com
                https://groleegni.net
                https://*.groleegni.net
                https://vouphoanooque.net
                https://*.vouphoanooque.net
                https://tzegilo.com
                https://*.tzegilo.com
                https://fleraprt.com
                https://*.fleraprt.com;

              connect-src 'self'
                https://*.vercel-insights.com
                https://*.google.com
                https://*.g.doubleclick.net
                https://*.googlesyndication.com
                https://*.googleadservices.com
                https://*.adservice.google.com
                https://*.adtrafficquality.google
                https://ep2.adtrafficquality.google
                https://*.monetag.com
                https://groleegni.net
                https://*.groleegni.net
                https://vouphoanooque.net
                https://*.vouphoanooque.net
                https://tzegilo.com
                https://*.tzegilo.com
                https://fleraprt.com
                https://*.fleraprt.com;

              frame-src 'self'
                https://web.telegram.org
                https://t.me
                https://googleads.g.doubleclick.net
                https://www.google.com
                https://ep2.adtrafficquality.google
                https://pagead2.googlesyndication.com;
            `.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;