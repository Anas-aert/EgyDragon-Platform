import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.googlesyndication.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
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
              default-src 'self';

              script-src 'self' 'unsafe-inline' 'unsafe-eval'
                https://*.vercel-insights.com
                https://pagead2.googlesyndication.com
                https://googleads.g.doubleclick.net
                https://tpc.googlesyndication.com
                https://fpyf8.com
                https://*.adtrafficquality.google
                https://vaimucuvikuwu.net
                https://my.rtmark.net;

              script-src-elem 'self' 'unsafe-inline' 'unsafe-eval'
                https://*.vercel-insights.com
                https://pagead2.googlesyndication.com
                https://googleads.g.doubleclick.net
                https://tpc.googlesyndication.com
                https://fpyf8.com
                https://*.adtrafficquality.google
                https://vaimucuvikuwu.net
                https://my.rtmark.net;

              style-src 'self' 'unsafe-inline';

              connect-src 'self'
                https://*.vercel-insights.com
                https://*.google.com
                https://*.g.doubleclick.net
                https://*.googlesyndication.com
                https://*.googleadservices.com
                https://*.adservice.google.com
                https://*.adtrafficquality.google
                https://fpyf8.com
                https://vaimucuvikuwu.net
                https://my.rtmark.net;

              frame-src 'self'
                https://googleads.g.doubleclick.net
                https://*.googlesyndication.com
                https://*.google.com
                https://*.adtrafficquality.google;
                
              img-src 'self' data: https: blob:;
            `.replace(/\s{2,}/g, " "),
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
