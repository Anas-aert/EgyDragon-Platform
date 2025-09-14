"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Users, Info, User, Settings, LogOut } from "lucide-react";
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
  const pathname = usePathname();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const userButtonRef = useRef<HTMLButtonElement | null>(null);

  // Navigation links
  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/users", label: "Users", icon: Users },
    { href: "/about", label: "About", icon: Info },
  ];

  // Check if link is active
  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      
      // Make sure the click is not on the user button or the menu itself
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(target) &&
        userButtonRef.current && 
        !userButtonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    // Close menu when pressing ESC
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

  // Close menu when losing focus
  const handleBlur = (e: React.FocusEvent) => {
    // Make sure focus didn't move to an element inside the menu
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
                    className="flex items-center space-x-2 px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none transition-colors"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none transition-colors"
                    role="menuitem"
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
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-black hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none cursor-pointer transition-colors"
                    role="menuitem"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
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
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-2 border-t border-gray-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isActiveLink(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`relative flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{link.label}</span>
                
                {/* Active indicator for mobile */}
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                )}
              </Link>
            );
          })}
          
          {/* Mobile User Section */}
          {status === "authenticated" && user && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src={user.image || "/default-avatar.png"}
                  width={40}
                  height={40}
                  alt="Profile"
                  className="rounded-full"
                />
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default function NavBar() {
  const { data, status } = useSession();
  return <Navvbar user={data?.user} status={status} signOut={signOut} />;
}