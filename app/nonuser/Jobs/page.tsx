"use client";

import React, { useEffect, useState } from "react";
import JobCard from "@/components/Jobcard";
import { useRouter } from "next/navigation";
import api from "@/utils/baseUrl";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";

interface Job {
  _id: string;
  title: string;
  jobType: string;
  location: string;
  salary: string;
  companyName: string;
  createdAt: string;
  jobMode: string;
}

const JobsList = () => {
  const router = useRouter();

  /* ================= STATE ================= */
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobMode, setJobMode] = useState("");

  const [initialLoading, setInitialLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  /* ================= FETCH JOBS ================= */
  const fetchJobs = async (isInitial = false) => {
    isInitial ? setInitialLoading(true) : setSearching(true);

    try {
      const res = await api.get("/user/fetchSearch", {
        params: {
          search,
          type: jobType,
          jobMode,
        },
      });

      setJobs(res.data?.data || []);
      setCurrentPage(1); // 🔑 reset page when data changes
    } catch (error) {
      console.error("Job fetch error:", error);
      setJobs([]);
    } finally {
      isInitial ? setInitialLoading(false) : setSearching(false);
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchJobs(true);
  }, []);

  /* ================= FILTER CHANGE ================= */
  useEffect(() => {
    fetchJobs(false);
  }, [jobType, jobMode]);

  /* ================= DEBOUNCED SEARCH ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = jobs.slice(
    startIndex,
    startIndex + jobsPerPage
  );

  /* ================= LOADING ================= */
  if (initialLoading) {
    return <Loading text="Fetching jobs..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">Latest Jobs</h1>

          {/* ================= SEARCH & FILTER ================= */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <input
              type="text"
              placeholder="Search title, company or location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-white text-sm w-full sm:w-64"
            />

            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-white text-sm"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>

            <select
              value={jobMode}
              onChange={(e) => setJobMode(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-white text-sm"
            >
              <option value="">All Modes</option>
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            {searching && (
              <span className="text-xs text-gray-400">
                Searching…
              </span>
            )}
          </div>

          {/* ================= JOB LIST ================= */}
          <div className="space-y-4">
            {currentJobs.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No jobs found
              </p>
            ) : (
              currentJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onClick={() =>
                    router.push(`/nonuser/onejob/${job._id}`)
                  }
                />
              ))
            )}
          </div>

          {/* ================= PAGINATION ================= */}
          {totalPages > 1 && (
            <div className="pt-8 flex justify-center">
              <div className="flex gap-1 bg-white px-3 py-2 rounded-xl shadow-sm ring-1 ring-gray-200">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 rounded-lg text-sm transition ${
                        page === currentPage
                          ? "bg-sky-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobsList;
