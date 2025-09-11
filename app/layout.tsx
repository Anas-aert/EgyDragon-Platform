import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./providers/nextAuthProvider";
import NavBar from "./_components/Navbar";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EgyDrag Anas's Bloger",
  description: "created by Anas Muhammed: Python & Full-Stack Programmer",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <NavBar />

          {/* المحتوى اللي هيتوسع */}
          <main className="flex-grow">{children}</main>
        </NextAuthProvider>

        {/* الفوتر دايمًا أسفل الشاشة */}
        <footer className="bg-blue-950 p-3.5 text-center">
          <h2 className="text-2xl mb-1.5 select-none text-white">
            © 2025 Anas. All rights reserved.
          </h2>
          <p className="text-lg select-none text-white">
            This website created by Anas Muhammed: Python & Full-Stack
            Programmer
          </p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
