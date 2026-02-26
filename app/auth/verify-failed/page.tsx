"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, RefreshCw, Home } from "lucide-react";

export default function VerifyFailedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate verification processing
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transition-all">

        {loading ? (
          <>
            <Loader2 className="mx-auto text-red-500 animate-spin" size={56} />
            <h2 className="text-xl font-semibold text-gray-800 mt-6">
              Verifying your link…
            </h2>
            <p className="text-gray-500 mt-2">
              Please wait while we check your verification link.
            </p>
          </>
        ) : (
          <>
            <AlertTriangle className="mx-auto text-red-500" size={64} />

            <h2 className="text-2xl font-bold text-gray-800 mt-6">
              Verification Failed
            </h2>

            <p className="text-gray-600 mt-3">
              This verification link is invalid or has expired.
              Please request a new verification email to activate your account.
            </p>

            <div className="mt-8 space-y-3">
              <button
                onClick={() => router.push("/auth/resend-verification")}
                className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold transition"
              >
                <RefreshCw size={18} />
                Resend Verification Email
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-medium transition"
              >
                <Home size={18} />
                Go to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}