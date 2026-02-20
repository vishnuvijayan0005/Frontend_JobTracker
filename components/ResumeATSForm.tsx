"use client";

import { useState } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import api from "@/utils/baseUrl";

interface ResumeATSFormProps {
  onResult: (data: any) => void;
}

export default function ResumeATSForm({ onResult }: ResumeATSFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !jobDescription.trim()) {
      alert("Please upload resume and add job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);

    const res = await api.post(
  "/user/analyze",
  formData,
  {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

      
// console.log(res.data);

      onResult(res.data); 
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6">

      <h2 className="text-2xl font-bold text-center">
        Check Your Resume ATS Score
      </h2>

      {/* 📄 Resume Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-black transition">
        <label className="cursor-pointer flex flex-col items-center gap-2">
          <UploadCloud size={40} className="text-gray-500" />

          <span className="text-sm text-gray-600">
            {file ? file.name : "Click to upload your resume (.pdf)"}
          </span>

          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      {/* 📝 Job Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Paste Job Description
        </label>
        <textarea
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>

      {/* 🚀 Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Checking ATS Score...
          </>
        ) : (
          <>
            <FileText size={18} />
            Analyze Resume
          </>
        )}
      </button>
    </div>
  );
}
