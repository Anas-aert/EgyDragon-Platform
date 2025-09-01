import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./providers/nextAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anas's Bloger",
  description: "created by Anas Muhammed: Python & Full-Stack Programmer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        {<NextAuthProvider>{children}</NextAuthProvider>}
        <footer className="bg-blue-950 p-3.5 text-center">
          <h2 className="text-2xl mb-1.5 select-none text-white">© 2025 Anas. All rights reserved.</h2>
          <p className="text-lg select-none text-white">This website created by Anas Muhammed: Python & Full-Stack Programmer</p>
        </footer>
      </body>
    </html>
  );
}
