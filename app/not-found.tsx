"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, Rootstate } from "@/store/store";
import { useRouter } from "next/navigation";
import { fetchMe } from "@/store/slice/auth/auth";

export default function NotFound() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const handleGoHome = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.role === "companyadmin") {
      router.push("/companyadmin");
    } else if (user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 overflow-hidden">
      {/* Icon */}
      <div className="text-7xl mb-6 animate-bounce">😕</div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-3 text-center tracking-tight">
        404 – Page Not Found
      </h1>

      {/* Description */}
      <p className="text-gray-600 mb-8 text-center max-w-md leading-relaxed">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
        Let’s get you back on track.
      </p>

      {/* Go Home Button */}
      <button
        onClick={handleGoHome}
        disabled={loading}
        className="relative z-10 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform disabled:opacity-50"
      >
        <ArrowLeft size={20} />
        Go Home
      </button>

      {/* Decorative Glow */}
      <div className="pointer-events-none absolute bottom-10 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl animate-pulse" />
    </div>
  );
}
