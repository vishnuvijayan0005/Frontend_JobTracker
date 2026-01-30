"use client";

import React, { Dispatch, SetStateAction } from "react";

interface FormProps {
  form: any;
  setForm: Dispatch<SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function UserProfileForm({
  form,
  setForm,
  handleSubmit,
}: FormProps) {
  /* ================= TEXT CHANGE HANDLER ================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (["city", "state", "country"].includes(name)) {
      setForm((prev: any) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else if (["linkedin", "github", "portfolio", "twitter"].includes(name)) {
      setForm((prev: any) => ({
        ...prev,
        socials: { ...prev.socials, [name]: value },
      }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  /* ================= PHOTO HANDLER ================= */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev: any) => ({
      ...prev,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    }));
  };

  /* ================= RESUME HANDLER ================= */
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev: any) => ({
      ...prev,
      resume: file,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* ================= PROFILE HEADER ================= */}
      <Section title="Profile Photo">
        <div className="flex items-center gap-6">
          <img
            src={form.photoPreview || "/avatar-placeholder.png"}
            className="h-28 w-28 rounded-full object-cover border"
            alt="Profile"
          />

          <label className="cursor-pointer bg-sky-600 text-white px-4 py-2 rounded-lg text-sm">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>
        </div>
      </Section>

      {/* ================= BASIC INFO ================= */}
      <Section title="Basic Information">
        <Grid cols={3}>
          <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
          <Input label="Middle Name" name="middleName" value={form.middleName} onChange={handleChange} />
          <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
        </Grid>

        <Grid cols={3}>
          <Input label="City" name="city" value={form.location.city} onChange={handleChange} />
          <Input label="State" name="state" value={form.location.state} onChange={handleChange} />
          <Input label="Country" name="country" value={form.location.country} onChange={handleChange} />
        </Grid>

        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
      </Section>

      {/* ================= PROFESSIONAL ================= */}
      <Section title="Professional Summary">
        <Input label="Headline" name="headline" value={form.headline} onChange={handleChange} />
        <Textarea label="Bio" name="bio" value={form.bio} onChange={handleChange} />
      </Section>

      {/* ================= SKILLS & RESUME ================= */}
      <Section title="Skills & Experience">
        <Input
          label="Skills (comma separated)"
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="React, Next.js, Node.js"
        />

        <Grid cols={2}>
          <Input
            label="Experience (years)"
            type="number"
            name="experience"
            value={form.experience}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Resume (PDF / DOC)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {form.resume && (
              <p className="text-sm text-gray-500 mt-1">
                Selected: {form.resume.name}
              </p>
            )}
          </div>
        </Grid>
      </Section>

      {/* ================= SOCIAL ================= */}
      <Section title="Social Profiles">
        <Grid cols={2}>
          <Input label="LinkedIn" name="linkedin" value={form.socials.linkedin} onChange={handleChange} />
          <Input label="GitHub" name="github" value={form.socials.github} onChange={handleChange} />
          <Input label="Portfolio" name="portfolio" value={form.socials.portfolio} onChange={handleChange} />
          <Input label="Twitter / X" name="twitter" value={form.socials.twitter} onChange={handleChange} />
        </Grid>
      </Section>

      {/* ================= PERSONAL ================= */}
      <Section title="Personal Info">
        <Grid cols={2}>
          <Select label="Gender" name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>

          <Input label="Education" name="education" value={form.education} onChange={handleChange} />
        </Grid>
      </Section>

      {/* ================= SUBMIT ================= */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-sky-600 text-white px-8 py-2 rounded-xl hover:bg-sky-700"
        >
          Save Profile
        </button>
      </div>
    </form>
  );
}

/* ================= REUSABLE UI ================= */

const Section = ({ title, children }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
    <h2 className="text-lg font-semibold border-b pb-2">{title}</h2>
    {children}
  </div>
);

const Grid = ({ cols, children }: any) => {
  const colClass =
    cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-3" : "";

  return <div className={`grid grid-cols-1 ${colClass} gap-4`}>{children}</div>;
};

const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input {...props} className="w-full border rounded-lg px-3 py-2" />
  </div>
);

const Textarea = ({ label, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea {...props} rows={4} className="w-full border rounded-lg px-3 py-2" />
  </div>
);

const Select = ({ label, children, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select {...props} className="w-full border rounded-lg px-3 py-2">
      {children}
    </select>
  </div>
);
