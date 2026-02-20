"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, ArrowLeft, EyeOff, Eye } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/baseUrl";
import { safeParse } from "valibot";

import img2 from "@/public/banner2.jpg";
import { RegisterSchema } from "@/lib/validators/login.schema";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = safeParse(RegisterSchema, {
      firstName,
      middleName,
      lastName,
      phone,
      email,
      password,
    });

    const fieldErrors: Record<string, string> = {};

    if (!result.success) {
      result.issues.forEach((issue) => {
        issue.path?.forEach((p) => {
          if (p.key) fieldErrors[p.key as string] = issue.message;
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
      const res = await api.post("/auth/registration", {
        firstName,
        middleName,
        lastName,
        phone,
        email,
        password,
      });

      if (res.data.success) {
        toast.success("Registration successful! Please login.");
        router.push("/auth/login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Banner */}
      <div
        className="relative w-full md:w-1/2 h-72 md:h-auto bg-cover bg-center"
        style={{ backgroundImage: `url(${img2.src})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 z-10 flex items-center gap-1 text-white"
        >
          <ArrowLeft size={18} /> Home
        </button>
      </div>

      {/* Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/95 md:bg-white backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
            Signup to CareerNest
          </h2>
              <p className="text-center text-gray-500">
            Fill your details
          </p>
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md space-y-4"
        >
          <Input icon={<User />} value={firstName} onChange={setFirstName} placeholder="First Name*" error={errors.firstName} />
          <Input icon={<User />} value={middleName} onChange={setMiddleName} placeholder="Middle Name" error={errors.middleName} />
          <Input icon={<User />} value={lastName} onChange={setLastName} placeholder="Last Name*" error={errors.lastName} />
          <Input icon={<Phone />} value={phone} onChange={setPhone} placeholder="Phone Number*" error={errors.phone} />
          <Input icon={<Mail />} value={email} onChange={setEmail} placeholder="Email*" error={errors.email} />
          <Input icon={<Lock />} value={password} onChange={setPassword} placeholder="Password*" type="password" error={errors.password} />
          <Input icon={<Lock />} value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm Password*" type="password" error={errors.confirmPassword} />

          <button className="w-full bg-sky-600 text-white py-3 rounded-xl">
            Sign Up
          </button>
        </form>
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
        <div/>
      </div>
      </div>
    </div>
  );
}


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
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="relative">
        {/* Left icon */}
        <span className="absolute left-3 top-3 text-gray-400">{icon}</span>

        {/* Input */}
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-10 ${
            isPassword ? "pr-12" : ""
          } py-3 border rounded-xl focus:outline-none focus:ring-2 transition ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-sky-500"
          }`}
        />

        {/* Eye toggle (password only) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

