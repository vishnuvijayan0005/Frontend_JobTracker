"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Briefcase,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import api from "@/utils/baseUrl";

interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  salary?: string;
}

const JOB_TYPES = ["All", "Full-time", "Part-time", "Internship", "Contract"];
const PAGE_SIZE = 6;

export default function JobSearchPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [jobType, setJobType] = useState("All");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchJobs = async (pageNo = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/user/fetchsearch", {
        params: {
          search: query,
          type: jobType !== "All" ? jobType : undefined,
          page: pageNo,
          limit: PAGE_SIZE,
        },
      });

      setJobs(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setHasSearched(false);
      setJobs([]);
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
  }, [query, jobType]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchJobs(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* ================= Hero Search ================= */}
      <div className="flex flex-col items-center justify-center text-center pt-28 pb-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Find your next{" "}
          <span className="text-sky-600">dream job</span>
        </h1>
        <p className="mt-4 text-gray-500 max-w-xl">
          Search thousands of jobs from top companies across locations
        </p>

        <div className="mt-8 w-full max-w-3xl bg-white rounded-full shadow-lg flex flex-col md:flex-row items-center p-2 gap-2">
          <div className="relative flex-1 w-full">
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
            {JOB_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= Results ================= */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {!hasSearched && (
          <p className="text-center text-gray-400">
            Start typing to search jobs 
          </p>
        )}

        {hasSearched && loading && <SkeletonGrid />}

        {hasSearched && !loading && jobs.length === 0 && <EmptyState />}

        {hasSearched && !loading && jobs.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onClick={() => router.push(`/user/jobsdetails/${job._id}`)}
                />
              ))}
            </div>

            {/* ================= Pagination ================= */}
            <div className="flex justify-center gap-4 mt-10">
              {page > 1 && (
                <button
                  onClick={() => handlePageChange(page - 1)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Prev
                </button>
              )}

              <button
                onClick={() => handlePageChange(page + 1)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Next
              </button>
            </div>

            {/* ================= View More ================= */}
            <div className="text-center mt-12">
              <button
                onClick={() => router.push("/jobs")}
                className="inline-flex items-center gap-2 text-sky-600 font-medium hover:underline"
              >
                View more jobs <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= Components ================= */

function JobCard({
  job,
  onClick,
}: {
  job: Job;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl border bg-white p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
    >
      <h3 className="text-lg font-semibold text-gray-900">
        {job.title}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{job.companyName}</p>

      <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase size={14} /> {job.jobType}
        </span>
      </div>

      {job.salary && (
        <p className="mt-4 text-sky-600 font-semibold flex items-center gap-1">
          <IndianRupee size={16} /> {job.salary}
        </p>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-48 rounded-2xl bg-gray-100 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-xl font-semibold text-gray-700">
        No jobs found 
      </p>
      <p className="text-gray-500 mt-2">
        Try different keywords or filters
      </p>
    </div>
  );
}
