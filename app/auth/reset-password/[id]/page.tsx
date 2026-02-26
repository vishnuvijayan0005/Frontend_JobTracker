"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/baseUrl";
import { resetpassword } from "@/lib/validators/login.schema";
import { safeParse } from "valibot";
import { Eye, EyeOff, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const params = useParams<{ id: string }>();

  const submit = async () => {
    const result = safeParse(resetpassword, { password });

    if (!result.success) {
      setError(result.issues[0].message);
      return;
    }

    setError(null);

    try {
      setLoading(true);

      await api.post(`/auth/reset-password/${params.id}`, {
        password,
      });

      toast.success("Password reset successful");
      router.push("/auth/login");
    } catch {
      setError("Reset link is invalid or expired. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
     
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <button
            onClick={() => router.push("/")}
            className="text-xl font-bold text-blue-600 hover:text-blue-700"
          >
            CareerNest
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Home
          </button>
        </div>
      </header>

      {/* ================= Main ================= */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Reset Password
          </h2>

          <p className="text-sm text-gray-600 text-center mb-6">
            For security reasons, your password reset link is valid for a limited
            time. Please choose a strong password you haven’t used before.
          </p>

          {/* Password Input */}
          <div className="mb-2">
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <Lock size={18} />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className={`w-full px-10 py-3 border rounded-xl pr-10 focus:outline-none focus:ring-2 transition ${
                  error
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

       

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {/* Help links */}
          <div className="flex justify-between mt-6 text-sm">
            <button
              onClick={() => router.push("/auth/forgot-password")}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Request new link
            </button>

            <button
              onClick={() => router.push("/auth/login")}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </main>

      {/* ================= Footer ================= */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} CareerNest. All rights reserved. <br />
          <span className="space-x-2">
            <button className="hover:underline">Privacy Policy</button>
            <span>·</span>
            <button className="hover:underline">Terms</button>
            <span>·</span>
            <button className="hover:underline">Support</button>
          </span>
        </div>
      </footer>
    </div>
  );
}
