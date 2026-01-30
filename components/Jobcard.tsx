"use client";

import { MapPin, Briefcase, IndianRupee, Clock, ArrowRight } from "lucide-react";

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    location: string;
    jobType: string;
    salary?: string;
    companyName?: string;
    createdAt?: string;
  };
  onClick?: () => void;
}

// ✅ Hydration-safe date formatter
const formatDate = (date?: string) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${(
    d.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};



export default function JobCard({ job, onClick }: JobCardProps) {
 
  return (
    <div
      onClick={onClick}
      className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm 
                 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-sky-600 transition">
            {job.title}
          </h2>
          {job.companyName && (
            <p className="text-sm text-gray-500 mt-0.5">
              {job.companyName}
            </p>
          )}
        </div>

        <span className="shrink-0 text-xs px-3 py-1 rounded-full bg-sky-100 text-sky-700 font-medium">
          {job.jobType}
        </span>
      </div>

      {/* Meta info */}
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{job.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-gray-400" />
          <span>{job.jobType}</span>
        </div>

        <div className="flex items-center gap-2 font-medium text-gray-800">
          <IndianRupee className="h-4 w-4 text-gray-400" />
          <span>{job.salary || "Not disclosed"}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-100" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        {job.createdAt && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Posted {formatDate(job.createdAt)}</span>
          </div>
        )}

        {/* CTA */}
        <button
          className="flex items-center gap-1 text-sm font-medium text-sky-600
                     group-hover:text-sky-700 transition"
        >
          See details
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
