"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Key, ArrowLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { loginUser } from "@/store/slice/auth/auth";
import toast, { Toaster } from "react-hot-toast";
import { safeParse } from "valibot";
import { LoginSchema } from "@/lib/validators/login.schema";

import img1 from "@/public/banner1.png";
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = safeParse(LoginSchema, { email, password });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.issues.forEach((issue) => {
        issue.path?.forEach((i) => {
          const key = i.key;
          if (key === "email" || key === "password") {
            if (fieldErrors[key]) {
              fieldErrors[key] += `, ${issue.message}`;
            } else {
              fieldErrors[key] = issue.message;
            }
          }
        });
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      const user = await dispatch(loginUser({ email, password })).unwrap();

      if (user.role === "admin") {
        toast.success("Welcome Boss");
        router.replace("/admin");
      } else if (user.role === "companyadmin") {
        toast.success("Welcome to the world of talent");
        router.replace("/companyadmin");
      } else {
        toast.success("Welcome to the future");
        router.replace("/user");
      }
    } catch (err) {
      console.error("Login failed", err);
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="relative hidden md:flex w-1/2 justify-center items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${img1.src})`,
          }}
        />

        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 z-10 flex items-center gap-1 bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded-full text-sm hover:bg-white/30 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </button>

        <div className="relative z-10 text-center text-white p-10 max-w-md">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Welcome Back!
          </h1>
          <p className="text-lg text-white/90">
            Manage your job applications and track your dream career.
          </p>
        </div>
      </div>

      <div className="flex w-full md:w-1/2 justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Login to JobTracker
          </h2>
          <p className="text-center text-gray-500">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-xl px-10 py-3 focus:outline-none focus:ring-2 transition ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-sky-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

      
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-xl px-10 py-3 focus:outline-none focus:ring-2 transition ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-sky-500"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-sky-600 hover:underline"
                onClick={() => router.push("/auth/forgot-password")}
              >
                Forgot password?
              </button>
            </div>


            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition"
            >
              Login
            </button>
          </form>

          <div className="flex items-center justify-center gap-3 text-gray-400 text-sm">
            <span className="border-b w-1/4"></span>
            OR
            <span className="border-b w-1/4"></span>
          </div>

          <p className="text-center text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/auth/user/registration")}
              className="text-sky-600 hover:underline"
            >
              Sign Up
            </button>
          </p>
          <p className="text-center text-gray-500">
            Are you a company?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/company/registration")}
              className="text-sky-600 hover:underline font-medium"
            >
              Register your company
            </button>
          </p>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
