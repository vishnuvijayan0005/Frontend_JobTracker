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
} from "lucide-react";
import api from "@/utils/baseUrl";
import { safeParse } from "valibot";
import { CompanyRegisterSchema } from "@/lib/validators/company-registration";

/* 🔹 Error keys MUST match schema */
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
        alert("Company registered successfully!");
        router.push("/auth/login");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-sky-600 items-center justify-center text-white">
        <div>
          <h1 className="text-5xl font-bold">Welcome, Company!</h1>
          <p className="mt-4 text-lg">Register & start hiring talent.</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={handleRegister} className="w-full max-w-md space-y-4">
          <h2 className="text-3xl font-bold text-center">
            Company Registration
          </h2>

          <Input icon={<Building2 size={18} />} value={companyName} onChange={setCompanyName} placeholder="Company Name" error={errors.companyName} />
          <Input icon={<LocateIcon size={18} />} value={companyLocation} onChange={setCompanyLocation} placeholder="Company Location" error={errors.companyLocation} />
          <Select value={category} onChange={setCategory} error={errors.category} />
          <Input icon={<Phone size={18} />} value={phone} onChange={setPhone} placeholder="Phone Number" error={errors.phone} />
          <Input icon={<Globe size={18} />} value={website} onChange={setWebsite} placeholder="Website (optional)" error={errors.website} />
          <Input icon={<Mail size={18} />} value={email} onChange={setEmail} placeholder="Email" error={errors.email} />
          <Input icon={<Lock size={18} />} value={password} onChange={setPassword} placeholder="Password" type="password" error={errors.password} />
          <Input icon={<Lock size={18} />} value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm Password" type="password" error={errors.confirmPassword} />

          <button className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold">
            Register Company
          </button>
        </form>
      </div>
    </div>
  );
}
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
  return (
    <div>
      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-xl px-10 py-3 focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-sky-500"
          }`}
        />
      </div>
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
            error
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-sky-500"
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
