"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export default function AccessDenied() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-sky-50 p-6 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-red-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl animate-pulse" />

      {/* Icon */}
      <div className="bg-gradient-to-r from-red-100 to-red-200 rounded-full p-8 mb-6 shadow-xl animate-fade-in">
        <ShieldAlert size={64} className="text-red-600 animate-bounce" />
      </div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-red-600 mb-4 text-center tracking-tight drop-shadow-lg">
        Access Denied
      </h1>

      {/* Description */}
      <p className="text-gray-700 mb-8 text-center max-w-md text-lg leading-relaxed">
        🚫 You don’t have permission to view this page.  
        Please contact the administrator or return safely to the homepage.
      </p>

      {/* Action Button */}
      <button
        onClick={() => router.push("/")}
        className="px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
      >
        ⬅ Go Home
      </button>
    </div>
  );
}
