"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Briefcase,
  IndianRupee,
} from "lucide-react";
import api from "@/utils/baseUrl";

interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  jobMode: string;
  salary?: string;
}

const JOB_TYPES = ["All", "Full-time", "Part-time", "Internship", "Contract"];
const JOB_MODES = ["All", "Onsite", "Remote", "Hybrid"];
const PAGE_SIZE = 6;

export default function JobSearchPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [jobType, setJobType] = useState("All");
  const [jobMode, setJobMode] = useState("All");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  /* ================= FETCH ================= */
  const fetchJobs = async (pageNo: number) => {
    setLoading(true);
    try {
      const res = await api.get("/user/fetchsearch", {
        params: {
          search: query || undefined,
          type: jobType !== "All" ? jobType : undefined,
          jobMode: jobMode !== "All" ? jobMode : undefined,
          page: pageNo,
          limit: PAGE_SIZE,
        },
      });

      setJobs(res.data?.data || []);
    } catch (err) {
      console.error("Job fetch error:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH / FILTER EFFECT ================= */
  useEffect(() => {
    // reset when nothing selected
    if (!query.trim() && jobType === "All" && jobMode === "All") {
      setJobs([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    setPage(1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchJobs(1);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, jobType, jobMode]);

  /* ================= PAGINATION ================= */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchJobs(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* ================= SEARCH ================= */}
      <div className="flex flex-col items-center text-center pt-28 pb-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          Find your next <span className="text-sky-600">dream job</span>
        </h1>

        <div className="mt-8 w-full max-w-3xl bg-white rounded-full shadow-lg flex flex-wrap gap-2 p-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title, company or location..."
              className="w-full pl-12 pr-4 py-3 rounded-full outline-none"
            />
          </div>

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="rounded-full border px-5 py-3"
          >
            {JOB_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <select
            value={jobMode}
            onChange={(e) => setJobMode(e.target.value)}
            className="rounded-full border px-5 py-3"
          >
            {JOB_MODES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= RESULTS ================= */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {!hasSearched && (
          <p className="text-center text-gray-400">
            Start typing or select filters to search jobs
          </p>
        )}

        {loading && <SkeletonGrid />}

        {!loading && hasSearched && jobs.length === 0 && <EmptyState />}

        {!loading && jobs.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onClick={() =>
                    router.push(`/user/jobsdetails/${job._id}`)
                  }
                />
              ))}
            </div>

            {/* ================= PAGINATION ================= */}
            <div className="flex justify-center gap-4 mt-10">
              {page > 1 && (
                <button
                  onClick={() => handlePageChange(page - 1)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Prev
                </button>
              )}

              {jobs.length === PAGE_SIZE && (
                <button
                  onClick={() => handlePageChange(page + 1)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl border bg-white p-5 shadow-sm hover:shadow-xl transition"
    >
      <h3 className="font-semibold">{job.title}</h3>
      <p className="text-sm text-gray-500">{job.companyName}</p>

      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase size={14} /> {job.jobType}
        </span>
        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
          {job.jobMode}
        </span>
      </div>

      {job.salary && (
        <p className="mt-3 text-sky-600 flex items-center gap-1">
          <IndianRupee size={16} /> {job.salary}
        </p>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div
          key={i}
          className="h-48 bg-gray-100 rounded-2xl animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-xl font-semibold">No jobs found</p>
      <p className="text-gray-500 mt-2">
        Try different keywords or filters
      </p>
    </div>
  );
}
