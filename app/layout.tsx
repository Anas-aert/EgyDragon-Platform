import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./providers/nextAuthProvider";
import NavBar from "./_components/Navbar";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // يحسن الـ performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EgyDragon - Anas's Blog",
  description: "Created by Anas Muhammed: Python & Full-Stack Programmer",
  keywords: [
    "Python",
    "Full-Stack",
    "Next.js",
    "Anas Muhammed",
    "Programming",
    "Blog",
  ],
  authors: [{ name: "Anas Muhammed" }],
  alternates: {
    canonical: "https://egydragon-anas.vercel.app/",
  },
  openGraph: {
    title: "EgyDragon - Anas's Blog",
    description: "Python & Full-Stack Programmer sharing projects and tutorials",
    url: "https://egydragon-anas.vercel.app/",
    siteName: "EgyDragon Blog",
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <NavBar />
          <main className="flex-grow">{children}</main>
        </NextAuthProvider>

        <footer className="bg-blue-950 p-3.5 text-center">
          <h2 className="text-2xl mb-1.5 select-none text-white">
            © 2025 Anas. All rights reserved.
          </h2>
          <p className="text-lg select-none text-white">
            This website was created by Anas Muhammed: Python & Full-Stack
            Programmer
          </p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
