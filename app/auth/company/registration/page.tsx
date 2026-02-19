"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Building2,
  LocateIcon,
  Phone,
  Globe,
  Layers,
  ArrowLeft,
  EyeOff,
  Eye,
} from "lucide-react";
import api from "@/utils/baseUrl";
import { safeParse } from "valibot";
import { CompanyRegisterSchema } from "@/lib/validators/company-registration";
import toast from "react-hot-toast";
import img3 from "@/public/meeting-room-office.jpg";

/* Error type must match schema */
type Errors = Partial<Record<
  | "companyName"
  | "companyLocation"
  | "category"
  | "phone"
  | "website"
  | "email"
  | "password"
  | "confirmPassword",
  string
>>;

export default function CompanyRegisterPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Errors>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = safeParse(CompanyRegisterSchema, {
      companyName,
      companyLocation,
      category,
      phone,
      website,
      email,
      password,
    });

    const fieldErrors: Errors = {};

    if (!result.success) {
      result.issues.forEach((issue) => {
        const key = issue.path?.[0]?.key as keyof Errors | undefined;
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = String(issue.message);
        }
      });
    }

    if (password !== confirmPassword) {
      fieldErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      const res = await api.post(
        "/auth/register-company",
        {
          companyName,
          companyLocation,
          category,
          phone,
          website,
          email,
          password,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Company registered successfully!");
        router.push("/auth/login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* ================= Banner ================= */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${img3.src})` }}
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
            Welcome to CareerNest!
          </h1>
          <p className="text-sm md:text-lg text-white/90 max-w-md mx-auto">
            Register your company and start hiring top talent today.
          </p>
        </div>
      </div>

      {/* ================= Form ================= */}
      <div className="relative z-20 flex w-full md:w-1/2 justify-center items-center px-4 py-10 md:py-20">
        <div className="w-full max-w-md bg-white/95 md:bg-white backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
            Company Registration
          </h2>
          <p className="text-center text-gray-500">
            Fill in your company details
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              icon={<Building2 size={18} />}
              value={companyName}
              onChange={setCompanyName}
              placeholder="Company Name"
              error={errors.companyName}
            />
            <Input
              icon={<LocateIcon size={18} />}
              value={companyLocation}
              onChange={setCompanyLocation}
              placeholder="Company Location"
              error={errors.companyLocation}
            />
            <Select value={category} onChange={setCategory} error={errors.category} />
            <Input
              icon={<Phone size={18} />}
              value={phone}
              onChange={setPhone}
              placeholder="Phone Number"
              error={errors.phone}
            />
            <Input
              icon={<Globe size={18} />}
              value={website}
              onChange={setWebsite}
              placeholder="Website (optional)"
              error={errors.website}
            />
            <Input
              icon={<Mail size={18} />}
              value={email}
              onChange={setEmail}
              placeholder="Email"
              error={errors.email}
            />
            <Input
              icon={<Lock size={18} />}
              value={password}
              onChange={setPassword}
              placeholder="Password"
              type="password"
              error={errors.password}
            />
            <Input
              icon={<Lock size={18} />}
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm Password"
              type="password"
              error={errors.confirmPassword}
            />

            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition"
            >
              Register Company
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="text-sky-600 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
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
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-xl px-10 ${
            isPassword ? "pr-12" : ""
          } py-3 focus:outline-none focus:ring-2 transition ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-sky-500"
          }`}
        />

        {/* Eye toggle (only for password) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
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


type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};
function Select({ value, onChange, error }: SelectProps) {
  return (
    <div>
      <div className="relative">
        <Layers className="absolute left-3 top-3 text-gray-400" size={18} />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-xl px-10 py-3 focus:ring-2 ${
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"
          }`}
        >
          <option value="">Select Company Category</option>
          <option value="software">Software</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="marketing">Marketing</option>
          <option value="other">Other</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
