"use client";

import { UserProfileSchema } from "@/lib/validators/userprofile";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { safeParse } from "valibot";

/* ================= TYPES ================= */
const DEFAULT_IMAGE = "/default.png";

export interface UserProfileFormState {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  headline: string;
  bio: string;
  skills: string; 
  experience: string;
  resume: File | null;
  gender: string;
  education: string;
  photo: File|string | null;
  photoPreview: string;
  socials: {
    linkedin: string;
    github: string;
    portfolio: string;
    twitter: string;
  };
}

export type UserProfileSubmitDTO = Omit<
  UserProfileFormState,
  "experience" | "skills"
> & {
  experience: number;
  skills: string[];
};

interface FormProps {
  form: UserProfileFormState;
  setForm: Dispatch<SetStateAction<UserProfileFormState>>;
  onSubmit: (form: UserProfileSubmitDTO) => void;
}



export default function UserProfileForm({ form, setForm, onSubmit }: FormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    return () => {
      if (form.photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(form.photoPreview);
      }
    };
  }, [form.photoPreview]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (["city", "state", "country"].includes(name)) {
      setForm((p) => ({ ...p, location: { ...p.location, [name]: value } }));
    } else if (["linkedin", "github", "portfolio", "twitter"].includes(name)) {
      setForm((p) => ({ ...p, socials: { ...p.socials, [name]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };


const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setForm((p) => ({
    ...p,
    photo: file,
    photoPreview: URL.createObjectURL(file), 
  }));
};


  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((p) => ({ ...p, resume: file }));
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedForm: UserProfileSubmitDTO = {
      ...form,
      experience: Number(form.experience || 0),
      skills: form.skills
        ? form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };

    const result = safeParse(UserProfileSchema, normalizedForm);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.issues.forEach((issue) => {
        if (!issue.path || issue.path.length === 0) return;

        const path = issue.path
          .map((p) => (typeof p.key === "number" ? `[${p.key}]` : p.key))
          .join(".");

        fieldErrors[path] = issue.message ?? "Invalid value";
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(normalizedForm);
  };

  /* ================= UI ================= */
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* PROFILE PHOTO */}
      <Section title="Profile Photo">
        <div className="flex items-center gap-6">
          <img
  src={form.photoPreview || DEFAULT_IMAGE || undefined}
  className="h-28 w-28 rounded-full object-cover border"
  alt="Profile"
/>
          <label className="cursor-pointer bg-sky-600 text-white px-4 py-2 rounded-lg text-sm">
            Change Photo
            <input type="file" hidden onChange={handlePhotoChange} />
          </label>
        </div>
      </Section>

      {/* BASIC INFO */}
      <Section title="Basic Information">
        <Grid cols={3}>
          <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
          <Input label="Middle Name" name="middleName" value={form.middleName} onChange={handleChange} error={errors.middleName} />
          <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} />
        </Grid>

        <Grid cols={3}>
          <Input label="City" name="city" value={form.location.city} onChange={handleChange} error={errors["location.city"]} />
          <Input label="State" name="state" value={form.location.state} onChange={handleChange} error={errors["location.state"]} />
          <Input label="Country" name="country" value={form.location.country} onChange={handleChange} error={errors["location.country"]} />
        </Grid>

        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
      </Section>

      {/* PROFESSIONAL */}
      <Section title="Professional Summary">
        <Input label="Headline" name="headline" value={form.headline} onChange={handleChange} error={errors.headline} />
        <Textarea label="Bio" name="bio" value={form.bio} onChange={handleChange} error={errors.bio} />
      </Section>

      {/* SKILLS */}
      <Section title="Skills & Experience">
        <Input
          label="Skills (comma separated)"
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="react, nextjs, node, mongodb"
          error={errors.skills}
        />

        <Grid cols={2}>
          <Input
            label="Experience (years)"
            type="number"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            error={errors.experience}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Resume</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
        </Grid>
      </Section>

      {/* SOCIALS */}
      <Section title="Social Profiles">
        <Grid cols={2}>
          <Input label="LinkedIn" name="linkedin" value={form.socials.linkedin} onChange={handleChange} error={errors["socials.linkedin"]} />
          <Input label="GitHub" name="github" value={form.socials.github} onChange={handleChange} error={errors["socials.github"]} />
          <Input label="Portfolio" name="portfolio" value={form.socials.portfolio} onChange={handleChange} error={errors["socials.portfolio"]} />
          <Input label="Twitter / X" name="twitter" value={form.socials.twitter} onChange={handleChange} error={errors["socials.twitter"]} />
        </Grid>
      </Section>

      {/* PERSONAL INFO */}
      <Section title="Personal Info">
        <Grid cols={2}>
          <Select label="Gender" name="gender" value={form.gender} onChange={handleChange} error={errors.gender}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>

          <Input label="Education" name="education" value={form.education} onChange={handleChange} error={errors.education} />
        </Grid>
      </Section>

      <div className="text-right">
        <button className="bg-sky-600 text-white px-8 py-2 rounded-xl hover:bg-sky-700">
          Save Profile
        </button>
      </div>
    </form>
  );
}

/* ================= UI HELPERS ================= */
const Section = ({ title, children }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow space-y-4">
    <h2 className="text-lg font-semibold border-b pb-2">{title}</h2>
    {children}
  </div>
);

const Grid = ({ cols, children }: any) => {
  const colClass = cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-3" : "";
  return <div className={`grid grid-cols-1 ${colClass} gap-4`}>{children}</div>;
};

const Input = ({ label, name, error, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...props}
      name={name}
      className={`w-full rounded-lg px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Textarea = ({ label, error, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea {...props} rows={4} className={`w-full border rounded-lg px-3 py-2 ${error ? "border-red-500" : "border-gray-300"}`} />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Select = ({ label, children, error, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select {...props} className={`w-full border rounded-lg px-3 py-2 ${error ? "border-red-500" : "border-gray-300"}`}>
      {children}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
