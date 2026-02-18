"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/baseUrl";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

interface JobData {
  _id?: string;
  title: string;
  location: string;
  jobType: string;
  jobMode: string;
  salary?: string;
  description: string;
  requirements?: string;
  qualifications?: string;
  benefits?: string[];
  seniorityLevel: string;
  interviewProcess?: string;
  experience?: string;
  skills?: string[];
  tags?: string[];
}

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobAdded: () => void;
  mode?: "add" | "edit";
  initialData?: JobData | null;
}

type Errors = Partial<Record<keyof JobData, string>>;

/* ================= COMPONENT ================= */

export default function AddJobModal({
  isOpen,
  onClose,
  onJobAdded,
  mode = "add",
  initialData = null,
}: AddJobModalProps) {
  /* ================= STATE ================= */

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [jobMode, setJobMode] = useState("Onsite");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [benefits, setBenefits] = useState("");
  const [seniorityLevel, setSeniorityLevel] = useState("Junior");
  const [interviewProcess, setInterviewProcess] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  /* ================= REFS (NEW) ================= */

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const skillsRef = useRef<HTMLInputElement>(null);

  /* ================= RESET ================= */

  const resetForm = () => {
    setTitle("");
    setLocation("");
    setJobType("Full-time");
    setJobMode("Onsite");
    setSalary("");
    setDescription("");
    setRequirements("");
    setQualifications("");
    setBenefits("");
    setSeniorityLevel("Junior");
    setInterviewProcess("");
    setExperience("");
    setSkills("");
    setTags("");
    setErrors({});
  };

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title);
      setLocation(initialData.location);
      setJobType(initialData.jobType);
      setJobMode(initialData.jobMode);
      setSalary(initialData.salary || "");
      setDescription(initialData.description);
      setRequirements(initialData.requirements || "");
      setQualifications(initialData.qualifications || "");
      setBenefits((initialData.benefits || []).join(", "));
      setSeniorityLevel(initialData.seniorityLevel);
      setInterviewProcess(initialData.interviewProcess || "");
      setExperience(initialData.experience || "");
      setSkills((initialData.skills || []).join(", "));
      setTags((initialData.tags || []).join(", "));
    } else {
      resetForm();
    }
  }, [mode, initialData]);

  /* ================= VALIDATION (UPDATED) ================= */

  const validate = () => {
    const newErrors: Errors = {};

    if (!title.trim()) newErrors.title = "Job title is required";
    if (!description.trim())
      newErrors.description = "Job description is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!skills.trim()) newErrors.skills = "At least one skill is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.title) {
        titleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        titleRef.current?.focus();
      } else if (newErrors.description) {
        descriptionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        descriptionRef.current?.focus();
      } else if (newErrors.location) {
        locationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        locationRef.current?.focus();
      } else if (newErrors.skills) {
        skillsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        skillsRef.current?.focus();
      }
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      title: title.trim(),
      location: location.trim(),
      jobType,
      jobMode,
      salary: salary.trim(),
      description: description.trim(),
      requirements: requirements.trim(),
      qualifications: qualifications.trim(),
      benefits: benefits.split(",").map(b => b.trim()).filter(Boolean),
      seniorityLevel,
      interviewProcess: interviewProcess.trim(),
      experience: experience.trim(),
      skills: skills.split(",").map(s => s.trim()).filter(Boolean),
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    };

    try {
      const res =
        mode === "edit" && initialData?._id
          ? await api.put(`/companyadmin/editjob/${initialData._id}`, payload, {
              withCredentials: true,
            })
          : await api.post("/companyadmin/postnewjob", payload, {
              withCredentials: true,
            });

      toast.success(res.data.message);
      onJobAdded();
      onClose();
      resetForm();
    } catch {
      toast.error("Failed to save job");
    }
  };

  const fieldClass = (key: keyof JobData) =>
    `border p-2 rounded-lg ${errors[key] ? "border-red-500" : ""}`;

  /* ================= UI ================= */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <motion.div className="bg-white rounded-2xl w-full max-w-lg p-6 mx-4 shadow-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">
              {mode === "edit" ? "Edit Job" : "Add New Job"}
            </h2>

            <div className="flex flex-col gap-3">

              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              <input
                ref={titleRef}
                value={title}
                onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: undefined })); }}
                className={fieldClass("title")}
                placeholder="Job Title*"
              />

              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              <textarea
                ref={descriptionRef}
                value={description}
                onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: undefined })); }}
                className={fieldClass("description")}
                rows={3}
                placeholder="Job Description*"
              />

              <textarea value={requirements} onChange={e => setRequirements(e.target.value)} className="border p-2 rounded-lg" rows={2} placeholder="Requirements" />

              <textarea value={qualifications} onChange={e => setQualifications(e.target.value)} className="border p-2 rounded-lg" rows={2} placeholder="Qualifications" />

              <textarea value={benefits} onChange={e => setBenefits(e.target.value)} className="border p-2 rounded-lg" rows={2} placeholder="Benefits (comma separated)" />

              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              <input
                ref={locationRef}
                value={location}
                onChange={e => { setLocation(e.target.value); setErrors(p => ({ ...p, location: undefined })); }}
                className={fieldClass("location")}
                placeholder="Location*"
              />

              <input value={experience} onChange={e => setExperience(e.target.value)} className="border p-2 rounded-lg" placeholder="Experience (e.g. 2–5 years)" />

              {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
              <input
                ref={skillsRef}
                value={skills}
                onChange={e => { setSkills(e.target.value); setErrors(p => ({ ...p, skills: undefined })); }}
                className={fieldClass("skills")}
                placeholder="Skills (comma separated)"
              />

              <input value={tags} onChange={e => setTags(e.target.value)} className="border p-2 rounded-lg" placeholder="Tags (comma separated)" />

              <textarea value={interviewProcess} onChange={e => setInterviewProcess(e.target.value)} className="border p-2 rounded-lg" rows={2} placeholder="Interview Process" />

              <input value={salary} onChange={e => setSalary(e.target.value)} className="border p-2 rounded-lg" placeholder="Salary" />

              <select value={jobType} onChange={e => setJobType(e.target.value)} className="border p-2 rounded-lg">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>

              <select value={jobMode} onChange={e => setJobMode(e.target.value)} className="border p-2 rounded-lg">
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Field Based">Field Based</option>
              </select>

              <select value={seniorityLevel} onChange={e => setSeniorityLevel(e.target.value)} className="border p-2 rounded-lg">
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
                <option>Lead</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => { onClose(); resetForm(); }} className="px-4 py-2 rounded-lg bg-gray-200">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-blue-600 text-white">
                {mode === "edit" ? "Update Job" : "Add Job"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
