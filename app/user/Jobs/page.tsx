"use client";

import React, { useEffect, useRef, useState } from "react";
import UserNavbar from "@/components/UserNavbar";
import JobCard from "@/components/Jobcard";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { fetchMe } from "@/store/slice/auth/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, Rootstate } from "@/store/store";
import Loading from "@/components/Loading";
import api from "@/utils/baseUrl";
import Footer from "@/components/Footer";

/* ================= TYPES ================= */
export interface Job {
  _id: string;
  title: string;
  jobType: string;
  location: string;
  salary: string;
  companyName: string;
  createdAt: string;
  status: string;
  jobMode: string;
  forcedclose: boolean;
}

/* ================= COMPONENT ================= */
const JobsList = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );

  /* ================= STATE ================= */
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showLoading, setShowLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobMode, setJobMode] = useState("");
  const [searching, setSearching] = useState(false);

  /* Backend pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  /* ================= AUTH ================= */
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const toastShown = useRef(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "user") {
      router.replace("/access-denied");
      return;
    }

    if (user?.isprofilefinished === false && !toastShown.current) {
      toastShown.current = true;
      toast.error("Please complete your profile to continue");
    }

    const timer = setTimeout(() => setShowLoading(false), 800);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user, router]);

  /* ================= FETCH JOBS ================= */
  const fetchJobs = async (page = 1, initial = false) => {
    initial ? setShowLoading(true) : setSearching(true);

    try {
      const res = await api.get("/user/fetchSearch", {
        params: {
          search,
          type: jobType,
          jobMode,
          page,
          limit,
        },
      });

      setJobs(res.data.data || []);
      setCurrentPage(res.data.pagination.currentPage);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      initial ? setShowLoading(false) : setSearching(false);
    }
  };

  /* Initial load */
  useEffect(() => {
    fetchJobs(1, true);
  }, []);

  /* Debounced search & filters */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs(1, false); // reset to page 1
    }, 800);

    return () => clearTimeout(timer);
  }, [search, jobType, jobMode]);

  if (loading || showLoading) {
    return <Loading text="Fetching your data..." />;
  }

  if (!isAuthenticated || !user) return null;

  const handleJobRouting = (id: string) => {
    router.push(`/user/jobsdetails/${id}`);
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserNavbar />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col min-h-full">
          <h1 className="text-2xl font-bold mb-4">Latest Jobs</h1>

          {/* Search & Filters */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <input
              type="text"
              placeholder="Search jobs, company, location"
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
              <option value="Remote">Remote</option>
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
              <span className="text-xs text-gray-400">Searching…</span>
            )}
          </div>

          {/* Jobs */}
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No jobs found
              </p>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onClick={() => handleJobRouting(job._id)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-auto pt-12 flex justify-center">
              <div className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-gray-200">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => fetchJobs(page)}
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
