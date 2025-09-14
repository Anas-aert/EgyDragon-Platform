"use client";

import { useState, useRef, useEffect } from "react";
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

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const userButtonRef = useRef<HTMLButtonElement | null>(null);

  // إغلاق المنيو عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      
      // تأكد أن الضغطة ليست على زر المستخدم أو المنيو نفسه
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(target) &&
        userButtonRef.current && 
        !userButtonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    // إغلاق المنيو عند الضغط على ESC
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
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

  // إغلاق المنيو عند فقدان التركيز
  const handleBlur = (e: React.FocusEvent) => {
    // تأكد أن التركيز لم ينتقل إلى عنصر داخل المنيو
    if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          EgyDrag
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-6">{/* روابط أخرى */}</div>

        {/* User Section / Sign In */}
        <div className="md:block">
          {status === "authenticated" && user ? (
            <div className="relative">
              <button
                ref={userButtonRef}
                className="flex items-center space-x-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-1"
                onClick={() => setOpen(!open)}
                onBlur={handleBlur}
                aria-expanded={open}
                aria-haspopup="true"
              >
                <Image
                  src={user.image || "/default-avatar.png"}
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
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50"
                  role="menu"
                  aria-orientation="vertical"
                  onBlur={handleBlur}
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none transition-colors"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none transition-colors"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-black hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none cursor-pointer transition-colors"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hover:scale-110 bg-blue-600 transition-all duration-700 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <Link href="/auth/MainAuth">Sign In</Link>
            </div>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden p-2 cursor-pointer text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle mobile menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">
          {/* روابط الموبايل */}
        </div>
      )}
    </nav>
  );
}

export default function NavBar() {
  const { data, status } = useSession();
  return <Navvbar user={data?.user} status={status} signOut={signOut} />;
}