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

// const demoJobs = [
//   {
//     _id: "1",
//     title: "Frontend Developer",
//     companyName: "TechNova",
//     location: "Bangalore, India",
//     jobType: "Full-time",
//     salary: "₹8–12 LPA",
//     createdAt: "2026-01-15",
//   },
//   {
//     _id: "2",
//     title: "Backend Engineer",
//     companyName: "Cloudify",
//     location: "Remote",
//     jobType: "Remote",
//     salary: "₹10–15 LPA",
//     createdAt: "2026-01-12",
//   },
//   {
//     _id: "3",
//     title: "UI/UX Designer",
//     companyName: "DesignHub",
//     location: "Mumbai, India",
//     jobType: "Contract",
//     salary: "₹5–7 LPA",
//     createdAt: "2026-01-10",
//   },
// ];
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
    (state: Rootstate) => state.auth,
  );

  const [showLoading, setShowLoading] = useState(true);

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
      toastShown.current = true; // mark toast as shown

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
    // console.log("clicked", id);

    router.push(`/user/jobsdetails/${id}`);
  };
 
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <UserNavbar />

      {/* Page Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Latest Jobs</h1>

        {/* Job Cards */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onClick={() => handlejobrouting(job._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsList;
