"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowLeft } from "lucide-react";
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
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = safeParse(LoginSchema, { email, password });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.issues.forEach((issue) => {
        issue.path?.forEach((i) => {
          const key = i.key;
          if (key === "email" || key === "password") {
            fieldErrors[key] = fieldErrors[key]
              ? fieldErrors[key] + `, ${issue.message}`
              : issue.message || "Invalid value";
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
 } catch (err: any) {
  // console.error("Login failed", err);

  const message =
    typeof err === "string"
      ? err
      : err?.message || "Login failed";

  // 🔔 Show proper toast
  toast.error(message);
}
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* ================= Banner ================= */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${img1.src})` }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 z-20 flex items-center gap-1 bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded-full text-sm hover:bg-white/30 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </button>

        {/* Banner text */}
        <div className="relative z-10 text-center px-6 md:px-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-white">
            Welcome Back!
          </h1>
          <p className="text-sm md:text-lg text-white/90 max-w-md mx-auto">
            Manage your job applications and track your dream career.
          </p>
        </div>
      </div>

      {/* ================= Form ================= */}
      <div className="relative z-20 flex w-full md:w-1/2 justify-center items-center px-4 py-10 md:py-20">
        <div className="w-full max-w-md bg-white/95 md:bg-white backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
            Login to CareerNest
          </h2>
          <p className="text-center text-gray-500">Enter your credentials to access your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              icon={<Mail size={18} />}
              value={email}
              onChange={setEmail}
              placeholder="Email"
              error={errors.email}
              type="email"
            />
            <Input
              icon={<Lock size={18} />}
              value={password}
              onChange={setPassword}
              placeholder="Password"
              error={errors.password}
              type="password"
            />

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

/* ================= Reusable Input ================= */
type InputProps = {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
};
function Input({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: InputProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <div className="relative">
        {/* Left icon */}
        <span className="absolute left-3 top-3 text-gray-400">{icon}</span>

        {/* Input */}
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-xl px-10 pr-12 py-3 focus:outline-none focus:ring-2 transition ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-sky-500"
          }`}
        />

        {/* Eye button (only for password) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {show ? <Lock size={18} /> : <Lock size={18} />}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
