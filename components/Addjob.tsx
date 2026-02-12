"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/baseUrl";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

interface JobData {
  _id?: string;
  title: string;
  location: string;
  jobType: string;
  jobMode:string;
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
  const  [jobMode, setJobMode] = useState("Onsite");
 
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

  /* ================= PREFILL (EDIT MODE) ================= */

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title);
      setLocation(initialData.location);
      setJobType(initialData.jobType);
      setSalary(initialData.salary || "");
      setJobMode(initialData.jobMode);
      setDescription(initialData.description);
      setRequirements(initialData.requirements || "");
      setQualifications(initialData.qualifications || "");
      setBenefits((initialData.benefits || []).join(", "));
      setSeniorityLevel(initialData.seniorityLevel);
      setInterviewProcess(initialData.interviewProcess || "");
      setExperience(initialData.experience || "");
      setSkills((initialData.skills || []).join(", "));
      setTags((initialData.tags || []).join(", "));
    }
  }, [mode, initialData]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!title || !location || !description) {
      toast.error("Please fill required fields: Title, Location, Description");
      return;
    }

    const payload = {
      title,
      location,
      jobType,
      salary,
       jobMode,
      description,
      requirements,
      qualifications,
      benefits: benefits.split(",").map((b) => b.trim()).filter(Boolean),
      seniorityLevel,
      interviewProcess,
      experience,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (mode === "edit" && initialData?._id) {
        const res=await api.put(
          `/companyadmin/editjob/${initialData._id}`,
          payload,
          { withCredentials: true }
        );
        toast.success(res.data.message)
      } else {
       const res= await api.post(
          "/companyadmin/postnewjob",
          payload,
          { withCredentials: true }
        );
        toast.success(res.data.message)
      }

      onJobAdded();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save job");
    }
  };

  /* ================= UI ================= */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-lg p-6 mx-4 shadow-lg overflow-y-auto max-h-[90vh]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              {mode === "edit" ? "Edit Job" : "Add New Job"}
            </h2>

            <div className="flex flex-col gap-3">
              <input
                placeholder="Job Title*"
                className="border p-2 rounded-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                placeholder="Job Description*"
                className="border p-2 rounded-lg"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <textarea
                placeholder="Requirements"
                className="border p-2 rounded-lg"
                rows={2}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />

              <textarea
                placeholder="Qualifications"
                className="border p-2 rounded-lg"
                rows={2}
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
              />

              <textarea
                placeholder="Benefits (comma separated)"
                className="border p-2 rounded-lg"
                rows={2}
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
              />

              <input
                placeholder="Location*"
                className="border p-2 rounded-lg"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <input
                placeholder="Experience (e.g. 2–5 years)"
                className="border p-2 rounded-lg"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />

              <input
                placeholder="Skills (comma separated)"
                className="border p-2 rounded-lg"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />

              <input
                placeholder="Tags (comma separated)"
                className="border p-2 rounded-lg"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />

              <textarea
                placeholder="Interview Process"
                className="border p-2 rounded-lg"
                rows={2}
                value={interviewProcess}
                onChange={(e) => setInterviewProcess(e.target.value)}
              />

              <input
                placeholder="Salary"
                className="border p-2 rounded-lg"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />

              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="border p-2 rounded-lg"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
              <select
                value={jobMode}
                onChange={(e) =>
                  setJobMode(e.target.value as JobData["jobMode"])
                }
                className="border p-2 rounded-lg"
              >
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Field Based">Field Based</option>
              </select>


              <select
                value={seniorityLevel}
                onChange={(e) => setSeniorityLevel(e.target.value)}
                className="border p-2 rounded-lg"
              >
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
                <option>Lead</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {mode === "edit" ? "Update Job" : "Add Job"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
