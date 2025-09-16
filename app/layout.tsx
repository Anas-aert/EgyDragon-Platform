import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./providers/nextAuthProvider";
import NavBar from "./_components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import VignetteLoader from "./_components/ads";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true, // تحسين أداء تحميل الخطوط
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true, // تحسين أداء تحميل الخطوط
});

export const metadata: Metadata = {
  title: "EgyDragon - Anas's Blog",
  description:
    "A Social Platform help you express your ideas and feeling freerly",
  keywords: [
    "Python tutorials",
    "Full-Stack development",
    "React best practices",
    "Web development blog",
    "Anas Muhammed",
    "EgyDragon blog",
    "Anas Muhammad programming",
    "Learn Python for beginners",
    "Full-Stack roadmap 2025",
    "Build blog with Next.js",
  ],

  authors: [{ name: "Anas Muhammed" }],
  alternates: {
    canonical: "https://egydragon-anas.vercel.app/",
  },
  openGraph: {
    title: "EgyDragon - Anas's Blog",
    description: "Created by Anas Muhammed: Python & Full-Stack Programmer",
    url: "https://egydragon-anas.vercel.app/",
    siteName: "EgyDragon Blog",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://egydragon-anas.vercel.app/Team.png", // أضف صورة Open Graph لتحسين المشاركة على وسائل التواصل
        width: 1200,
        height: 630,
        alt: "EgyDragon Blog",
      },
    ],
  },
  robots: "index, follow", // إضافة توجيهات لمحركات البحث
  twitter: {
    card: "summary_large_image", // تحسين ظهور الموقع على تويتر
    title: "EgyDragon - Anas's Blog",
    description: "Created by Anas Muhammed: Python & Full-Stack Programmer",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4683128936517413"
          crossOrigin="anonymous"
        ></script>

        <meta
          name="description"
          content="A Social Platform help you express your ideas and feeling freerly"
        />
        {/* 
        <script
          src="https://fpyf8.com/88/tag.min.js"
          data-zone="170492"
          async
          data-cfasync="false"
        ></script> */}

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/Team.png" />
        <link
          rel="icon"
          type="image/png"
          href="https://egydragon-anas.vercel.app/Team.png"
        />

        {/* Google Search Console verification */}
        <meta
          name="google-site-verification"
          content="K_ia_fdAuYdnwaITlI-2Khh1EnbHbDojnvzzwHsbCDs"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-4683128936517413"
        ></meta>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "EgyDragon - Anas's Blog",
              url: "https://egydragon-anas.vercel.app/",
              description:
                "Python & Full-Stack Programmer sharing projects and tutorials",
              author: {
                "@type": "Person",
                name: "Anas Muhammed",
              },
            }),
          }}
        />
      </head>
      <body
        className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script src="https://otieu.com/4/9886165" />
        <VignetteLoader />
        <NextAuthProvider>
          <NavBar />
          <main className="flex-grow">{children}</main>
        </NextAuthProvider>

        {/* Improved Footer */}
        <footer className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 text-center text-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 select-none">
              © 2025 Anas. All rights reserved.
            </h2>
            <p className="text-lg mb-4 select-none opacity-90">
              This website was created by Anas Muhammed: Python & Full-Stack
              Programmer
            </p>

            {/* Social Media Links */}
            <div className="flex justify-center space-x-4 mb-4">
              <a
                href="https://github.com/Anas-aert"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-800 rounded-full hover:bg-blue-700 transition-colors duration-300"
                aria-label="Visit my GitHub"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/anas-muhammad-72bb99374"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-800 rounded-full hover:bg-blue-700 transition-colors duration-300"
                aria-label="Connect on LinkedIn"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>

            <p className="text-sm opacity-75">
              Made with Next.js, Tailwind CSS, and ❤️Anas💖
            </p>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
