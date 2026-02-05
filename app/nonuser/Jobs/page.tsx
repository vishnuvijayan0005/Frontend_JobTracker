"use client";

import React, { useEffect, useRef, useState } from "react";
import JobCard from "@/components/Jobcard";
import { useRouter } from "next/navigation";
import api from "@/utils/baseUrl";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";

interface Job {
  _id: string;
  title: string;
  description: string;
  experience: number;
  jobType: string;
  location: string;
  salary: string;
  skills: string[];
  status: string;
  company: string;
  companyName: string;
  createdAt: string;
}

const JobsList = () => {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [showLoading, setShowLoading] = useState(true);

  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  /* ================= FILTER ================= */
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  /* ================= FETCH JOBS ================= */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/user/getnonuserjobs");
        const data = res.data?.data || [];
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setShowLoading(false);
      }
    };
    fetchJobs();
  }, []);

  /* ================= APPLY FILTER ================= */
  useEffect(() => {
    let tempJobs = [...jobs];

    if (jobTypeFilter) {
      tempJobs = tempJobs.filter(
        (job) => job.jobType === jobTypeFilter
      );
    }

    if (locationFilter) {
      tempJobs = tempJobs.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredJobs(tempJobs);
    setCurrentPage(1); // 🔑 reset page after filter
  }, [jobTypeFilter, locationFilter, jobs]);

  if (showLoading) return <Loading text="Fetching jobs..." />;

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(
    indexOfFirstJob,
    indexOfLastJob
  );

  const handlejobrouting = (id: string) => {
    router.push(`/nonuser/onejob/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col min-h-full">
          <h1 className="text-2xl font-bold mb-4">Latest Jobs</h1>

          {/* ================= FILTER BAR ================= */}
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-white text-sm"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>

            <input
              type="text"
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-white text-sm"
            />

            {(jobTypeFilter || locationFilter) && (
              <button
                onClick={() => {
                  setJobTypeFilter("");
                  setLocationFilter("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 text-sm"
              >
                Clear Filters
              </button>
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
                  onClick={() => handlejobrouting(job._id)}
                />
              ))
            )}
          </div>

          {/* ================= PAGINATION ================= */}
          {totalPages > 1 && (
            <div className="mt-auto pt-12 flex justify-center">
              <div className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-gray-200">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                  ← Prev
                </button>

                {/* Pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium ${
                        page === currentPage
                          ? "bg-sky-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                  Next →
                </button>
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
