"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import api from "@/utils/baseUrl";
import { safeParse, object, string, minLength, regex, nonEmpty, email as emailValidator } from "valibot";
import { LoginSchema } from "@/lib/validators/login.schema";

export default function RegisterPage() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Field errors
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Valibot schema
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // 1️⃣ Validate inputs
    const result = safeParse(LoginSchema, { email, password });

    const fieldErrors: Record<string, string> = {};

    if (!result.success) {
      result.issues.forEach((issue) => {
        issue.path?.forEach((i) => {
          const key = i.key;
          if (key === "name" || key === "email" || key === "password") {
            if (fieldErrors[key]) {
              fieldErrors[key] += `, ${issue.message || "Invalid value"}`;
            } else {
              fieldErrors[key] = issue.message || "Invalid value";
            }
          }
        });
      });
    }

    // 2️⃣ Check confirm password
    if (password !== confirmPassword) {
      fieldErrors.confirmPassword = "Passwords do not match";
    }

    // If there are errors, show them
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    // 3️⃣ Submit API request
    try {
      const response = await api.post(
        "/auth/registration",
        { name, email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("Registration successful! Please login.");
        router.push("/auth/login");
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Illustration */}
      <div className="hidden md:flex w-1/2 bg-sky-600 justify-center items-center">
        <div className="text-center text-white p-10">
          <h1 className="text-5xl font-bold mb-4">Join JobTracker!</h1>
          <p className="text-lg">
            Create an account and start tracking your applications and dream jobs today.
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Create your account</h2>
          <p className="text-center text-gray-500">Enter your details to sign up</p>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full border rounded-xl px-10 py-3 focus:outline-none focus:ring-2 transition ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-xl px-10 py-3 focus:outline-none focus:ring-2 transition ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-xl px-10 py-3 focus:outline-none focus:ring-2 transition ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full border rounded-xl px-10 py-3 focus:outline-none focus:ring-2 transition ${
                  errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition"
            >
              Sign Up
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <button onClick={() => router.push("/auth/login")} className="text-sky-600 hover:underline">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
