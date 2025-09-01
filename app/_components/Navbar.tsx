"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

type NavbarProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  status: "loading" | "authenticated" | "unauthenticated";
};

export default function Navbar({ user, status }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          EgyDrag
        </Link>

        {/* Links */}
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-blue-600 transition-all duration-700 text-black">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-all duration-700 text-black">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition-all duration-700 text-black">
            Contact
          </Link>
        </div>

        {/* User section */}
        {status === "authenticated" && user ? (
          <div className="relative">
            <button
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <Image
                src={user.image as string}
                width={40}
                height={40}
                alt="Profile"
                className="rounded-full"
              />
              <span className="font-medium text-black">{user.name}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-black hover:bg-gray-900 hover:text-white"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-black hover:bg-gray-900 hover:text-white"
                >
                  Settings
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-black hover:bg-red-600 cursor-pointer hover:text-white"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth/MainAuth"
            className="bg-blue-600 transition-all duration-1000 hover:scale-110 text-black px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
