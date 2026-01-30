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
  updatedAt: string;
}

const JobsList = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );
  const [showLoading, setShowLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; // Show 5 jobs per page

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
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex border`}
        >
          <div className="w-2 bg-red-600 rounded-l-2xl" />
          <div className="flex-1 p-4">
            <p className="text-sm font-semibold text-gray-800">
              Profile Incomplete
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Please complete your profile before continuing.
            </p>

            <div className="mt-3 flex gap-3">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  router.push("/user/profile");
                }}
                className="text-sm font-medium text-sky-600 hover:underline"
              >
                Complete now
              </button>
            </div>
          </div>
        </div>
      ));
    }

    const timer = setTimeout(() => setShowLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await api.get("/user/getjobs");
      setJobs(res.data.data);
    };
    fetchJobs();
  }, []);

  if (loading || showLoading) return <Loading text="Fetching your data..." />;

  if (!isAuthenticated || !user) return null;

  const handlejobrouting = (id: string) => {
    router.push(`/user/jobsdetails/${id}`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
<div className="min-h-screen flex flex-col bg-gray-50">
  <UserNavbar />

  {/* MAIN CONTENT */}
  <main className="flex-1">
    <div className="max-w-5xl mx-auto px-4 py-6 flex min-h-full flex-col">
      <h1 className="text-2xl font-bold mb-4">Latest Jobs</h1>

      {/* Job Cards */}
      <div className="space-y-4">
        {currentJobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onClick={() => handlejobrouting(job._id)}
          />
        ))}
      </div>

      {/* Pagination pushed to bottom */}
      {totalPages > 1 && (
        <div className="mt-auto pt-12 flex justify-center">
          <div className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-gray-200">
            
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition
                hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Prev
            </button>

            {/* Pages */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition
                    ${
                      page === currentPage
                        ? "bg-sky-600 text-white shadow-md shadow-sky-200"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition
                hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
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
