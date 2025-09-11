"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface User {
  email?: string;
  image?: string;
  name?: string;
}

interface NavbarProps {
  status: "authenticated" | "unauthenticated" | "loading";
  user?: User | null;
  signOut: () => void;
}


function Navvbar({ status, user, signOut }: NavbarProps) {
  
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          EgyDrag
        </Link>

        {/* Links (hidden on small screens) */}
        <div className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="select-none hover:scale-110 hover:text-blue-600 transition-all duration-500 text-black"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="select-none hover:scale-110 hover:text-blue-600 transition-all duration-500 text-black"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="select-none hover:scale-110 hover:text-blue-600 transition-all duration-500 text-black"
          >
            Contact
          </Link>
        </div>

        {/* User Section / Sign In */}
        <div className="md:block">
          {status === "authenticated" && user ? (
            <div className="relative">
              <button
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <Image
                  src={user.image}
                  width={40}
                  height={40}
                  alt="Profile"
                  className="rounded-full"
                  priority
                />
                <span className="font-medium hidden lg:block text-black">
                  {user.name}
                </span>
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
                    onClick={() => {
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-black hover:bg-red-600 cursor-pointer hover:text-white"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hover:scale-110 bg-blue-600 transition-all duration-700 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700">
            <Link
              href="/auth/MainAuth"
            >
              Sign In
            </Link>
            </div>
          )}
        </div>

        {/* Hamburger (only on small screens) */}
        <button
          className="md:hidden p-2 cursor-pointer text-black"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">
          <Link href="/" className="block text-black select-none hover:text-blue-600 active:text-red-500">
            Home
          </Link>
          <Link href="/about" className="block select-none text-black hover:text-blue-600">
            About
          </Link>
          <Link
            href="/contact"
            className="block select-none text-black hover:text-blue-600"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}

export default function NavBar() {
  const { data, status } = useSession();
  
  return (
    <Navvbar user={data?.user} status={status} signOut={signOut}/>
  )
}