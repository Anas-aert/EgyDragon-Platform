"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Contact,
  Info,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface User {
  email?: string;
  image?: string;
  name?: string;
}

export default function NavBar() {
  const { data, status } = useSession();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const userButtonRef = useRef<HTMLButtonElement | null>(null);

  const user = data?.user;

  // links
  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/contact", label: "Contact", icon: Contact },
    { href: "/about", label: "About", icon: Info },
  ];

  const isActiveLink = (href: string) => pathname === href;

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          EgyDrag
        </Link>

        {/* Links (desktop) */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isActiveLink(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Section (desktop) */}
        <div className="hidden md:block">
          {status === "authenticated" && user ? (
            <div className="relative">
              <button
                ref={userButtonRef}
                className="flex items-center space-x-2 cursor-pointer focus:outline-none rounded-lg p-1"
                onClick={() => setOpen(!open)}
              >
                <Image
                  src={user.image ? user.image : "/default-avatar.png"}
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
                <div
                  ref={dropdownRef}
                  className="absolute right-0 translate-y-1 w-48 bg-white rounded-md shadow-lg py-2 border border-gray-200"
                >
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-black hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-black hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                    className="flex items-center cursor-pointer space-x-2 w-full text-left px-4 py-2 text-black hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/MainAuth"
              className="hover:scale-110 bg-blue-600 transition-all duration-700 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden p-2 cursor-pointer text-black focus:outline-none rounded"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            {/* User Section (mobile) */}
            {/* {status === "authenticated" && user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/MainAuth"
                className="hover:scale-105 bg-blue-600 transition-all duration-300 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            )} */}
          </div>
        </div>
      )}
    </nav>
  );
}
