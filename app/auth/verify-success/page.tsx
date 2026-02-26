"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";

export default function VerifySuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate verification processing UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transition-all">

        {loading ? (
          <>
            <Loader2 className="mx-auto text-sky-500 animate-spin" size={56} />
            <h2 className="text-xl font-semibold text-gray-800 mt-6">
              Verifying your email…
            </h2>
            <p className="text-gray-500 mt-2">
              Please wait while we activate your account.
            </p>
          </>
        ) : (
          <>
            <CheckCircle className="mx-auto text-green-500" size={64} />
            <h2 className="text-2xl font-bold text-gray-800 mt-6">
              Email Verified Successfully 🎉
            </h2>
            <p className="text-gray-600 mt-3">
              Your account is now active. You can safely log in and start using
              CareerNest.
            </p>

            <button
              onClick={() => router.push("/auth/login")}
              className="mt-8 w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}