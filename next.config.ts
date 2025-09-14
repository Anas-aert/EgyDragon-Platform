import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // صور Google
      { protocol: "https", hostname: "avatars.githubusercontent.com" }, // صور GitHub
      { protocol: "https", hostname: "images.unsplash.com" }, // Unsplash
      { protocol: "https", hostname: "*.googlesyndication.com" }, // صور إعلانات Google
      { protocol: "https", hostname: "*.googleusercontent.com" }, // صور مرتبطة بحساب Google
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
                https://tpc.googlesyndication.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data:
                https://lh3.googleusercontent.com
                https://avatars.githubusercontent.com
                https://images.unsplash.com
                https://*.googlesyndication.com
                https://*.googleusercontent.com;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' https://*.vercel-insights.com;
              frame-src 'self'
                https://googleads.g.doubleclick.net
                https://pagead2.googlesyndication.com;
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
