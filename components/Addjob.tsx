"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/baseUrl";

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobAdded: () => void;
}

export default function AddJobModal({
  isOpen,
  onClose,
  onJobAdded,
}: AddJobModalProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
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

  const handleSubmit = async () => {
    if (!title || !location || !description) {
      alert("Please fill required fields: Title, Location, Description");
      return;
    }

    const newJob = {
      title,
      location,
      jobType,
      salary,
      description,
      requirements,
      qualifications,
      benefits,
      seniorityLevel,
      interviewProcess,
      experience,
      skills,
      tags,
    };

    const res = await api.post("/companyadmin/postnewjob", { newJob });

    if (res.data.success) {
      onJobAdded();
      onClose();
    } else {
      onClose();
    }

    // Reset
    setTitle("");
    setLocation("");
    setJobType("Full-time");
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
  };

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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4">Add New Job</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
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
                placeholder="Job Requirements"
                className="border p-2 rounded-lg"
                rows={3}
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
                type="text"
                placeholder="Location*"
                className="border p-2 rounded-lg"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <input
                type="text"
                placeholder="Experience Required (e.g., 2–5 years)"
                className="border p-2 rounded-lg"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />

              <input
                type="text"
                placeholder="Skills (comma separated)"
                className="border p-2 rounded-lg"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />

              <input
                type="text"
                placeholder="Tags / Keywords (comma separated)"
                className="border p-2 rounded-lg"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />

              <textarea
                placeholder="Interview Process (e.g., HR → Tech → Manager)"
                className="border p-2 rounded-lg"
                rows={2}
                value={interviewProcess}
                onChange={(e) => setInterviewProcess(e.target.value)}
              />

              <input
                type="text"
                placeholder="Salary (optional)"
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
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Add Job
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
