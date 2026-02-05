"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/nonuser/Jobs" },
    { name: "Companies", href: "/companies" },
  ];

  return (
    <nav className="backdrop-blur-md bg-white/80 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
           CareerNest
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-gray-700 font-medium hover:text-blue-600 transition-all after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all hover:after:w-full"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Login/Register Buttons */}
          <div className="hidden md:flex space-x-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-blue-600 font-medium border border-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Login
            </Link>
            <Link
              href="/auth/user/registration"
              className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200 animate-slide-down">
          <div className="flex flex-col items-center px-6 pt-4 pb-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="w-full text-center px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                {item.name}
               
              </Link>
            ))}
            <div className="flex flex-col w-full space-y-2">
              <Link
                href="/auth/login"
                className="block text-center px-4 py-2 font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="block text-center px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
