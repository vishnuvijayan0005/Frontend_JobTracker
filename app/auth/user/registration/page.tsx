"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/baseUrl";
import { safeParse } from "valibot";
import { LoginSchema } from "@/lib/validators/login.schema";
import img2 from "@/public/banner2.png";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = safeParse(LoginSchema, { email, password });
    const fieldErrors: Record<string, string> = {};

    if (!result.success) {
      result.issues.forEach((issue) => {
        issue.path?.forEach((i) => {
          const key = i.key as string | undefined;
          if (key) fieldErrors[key] = issue.message ?? "Invalid value";
        });
      });
    }

    if (password !== confirmPassword) {
      fieldErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    try {
      const res = await api.post(
        "/auth/registration",
        { name, email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Registration successful! Please login.");
        router.push("/auth/login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* ================= Banner ================= */}
      <div className="relative w-full md:w-1/2 h-72 md:h-auto flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${img2.src})` }}
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
            Join CareerNest!
          </h1>
          <p className="text-sm md:text-lg text-white/90 max-w-md mx-auto">
            Create an account and start tracking your applications and dream jobs today.
          </p>
        </div>
      </div>

      {/* ================= Form ================= */}
      <div className="relative z-20 flex w-full md:w-1/2 justify-center items-center px-4 py-10 md:py-20 bg-white">
        <div className="w-full max-w-md bg-white/95 md:bg-white backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
            Create your account
          </h2>
          <p className="text-center text-gray-500">
            Enter your details to sign up
          </p>

          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              icon={<User size={18} />}
              placeholder="Full Name"
              value={name}
              onChange={setName}
              error={errors.name}
            />
            <Input
              icon={<Mail size={18} />}
              placeholder="Email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              type="email"
            />
            <Input
              icon={<Lock size={18} />}
              placeholder="Password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              type="password"
            />
            <Input
              icon={<Lock size={18} />}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={errors.confirmPassword}
              type="password"
            />

            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-sky-600 hover:underline"
            >
              Login
            </button>
          </p>

          <p className="text-center text-gray-500">
            Are you a company?{" "}
            <button
              onClick={() => router.push("/auth/company/registration")}
              className="text-sky-600 hover:underline font-medium"
            >
              Register your company
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= Reusable Input ================= */
function Input({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border rounded-xl px-10 py-3 focus:outline-none focus:ring-2 transition ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-sky-500"
          }`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
