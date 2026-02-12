"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import api from "@/utils/baseUrl";
import Loading from "@/components/Loading";
import UserNavbar from "@/components/UserNavbar";
import { fetchMe } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import JobShare from "@/components/JobShare";

/* ================= TYPES ================= */

interface Job {
  _id: string;
  title: string;
  companyName: string;
  description: string;
  requirements?: string;
  qualifications?: string;
  interviewProcess?: string;
  location: string;
  experience: string;
  seniorityLevel: string;
  skills: string[];
  benefits: string[];
  tags: string[];
  jobType: string;
  salary: string;
  status: string;
  createdAt: string;
}

/* ================= PAGE ================= */

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );

  const [showLoading, setShowLoading] = useState(true);
  const [job, setJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "user") {
      router.replace("/access-denied");
      return;
    }

    if (user?.isprofilefinished === false) {
      toast.error("Please complete your profile before applying");
      router.push("/user/profile");
      return;
    }

    const timer = setTimeout(() => setShowLoading(false), 600);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user, router]);

  /* ================= FETCH JOB ================= */

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await api.get(`/user/jobsdetails/${id}`, {
          withCredentials: true,
        });
        setJob(res.data.data);
        setApplied(res.data.jobStatus === "applied");
      } catch {
        toast.error("Failed to load job details");
      }
    };

    fetchJob();
  }, [id]);

  /* ================= APPLY ================= */

  const handleApplication = async (jobId: string) => {
    if (applied || applying) return;

    setApplying(true);

    try {
      await toast.promise(
        api.post(`/user/addapplication/${jobId}`, {}, { withCredentials: true }),
        {
          loading: "Applying for job...",
          success: "Application submitted successfully 🎉",
          error: "Something went wrong",
        }
      );

      setApplied(true);
    } finally {
      setApplying(false);
    }
  };

  const handleWithdraw = async (jobId: string) => {
    try {
      await toast.promise(
        api.delete(`/user/withdrawapplication/${jobId}`, {
          withCredentials: true,
        }),
        {
          loading: "Withdrawing application...",
          success: "Application withdrawn",
          error: "Failed to withdraw",
        }
      );

      setApplied(false);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= LOADING ================= */

  if (loading || showLoading) {
    return <Loading text="Fetching job details..." />;
  }

  if (!job) {
    return <p className="text-center mt-10">Job not found</p>;
  }

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UserNavbar />

      <div className="max-w-6xl mx-auto px-4 pt-6">
        <BackButton label="Jobs" />
      </div>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Title & Company */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="text-gray-600 mt-2 text-lg">{job.companyName}</p>
              <p className="mt-1 text-sm text-gray-500">
                {job.location} • {job.jobType} • {job.experience} yrs
              </p>
            </div>

            {/* About the Role */}
            <div className="bg-white rounded-3xl shadow-sm p-8 space-y-4">
              <h2 className="text-xl font-semibold">About the Role</h2>
              <p className="whitespace-pre-line">{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-3xl shadow-sm p-8 space-y-4">
                <h2 className="text-xl font-semibold">Requirements</h2>
                <p className="whitespace-pre-line">{job.requirements}</p>
              </div>
            )}

            {/* Qualifications */}
            {job.qualifications && (
              <div className="bg-white rounded-3xl shadow-sm p-8 space-y-4">
                <h2 className="text-xl font-semibold">Qualifications</h2>
                <p className="whitespace-pre-line">{job.qualifications}</p>
              </div>
            )}

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm p-8 space-y-4">
                <h2 className="text-xl font-semibold">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits?.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm p-8 space-y-4">
                <h2 className="text-xl font-semibold">Benefits</h2>
                <ul className="list-disc list-inside space-y-1">
                  {job.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Interview Process */}
            {job.interviewProcess && (
              <div className="bg-white rounded-3xl shadow-sm p-8 space-y-4">
                <h2 className="text-xl font-semibold">Interview Process</h2>
                <p className="whitespace-pre-line">{job.interviewProcess}</p>
              </div>
            )}

            {/* Tags */}
            {job.tags?.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm p-8 space-y-4">
                <h2 className="text-xl font-semibold">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-sky-100 text-sky-700 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/*  SHARE SECTION */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-lg font-semibold mb-4">Share this job</h2>
              <JobShare title={job.title} company={job.companyName} />
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div>
            <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-24 space-y-4">
              <p className="text-sm text-gray-500">Job Status</p>
              <p
                className={`font-semibold ${
                  job.status === "Open" ? "text-green-600" : "text-red-600"
                }`}
              >
                {job.status}
              </p>

              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-semibold mb-4">{job.salary}</p>

              <button
                disabled={applied || applying || job.status !== "Open"}
                onClick={() => handleApplication(job._id)}
                className={`w-full py-3 rounded-xl font-semibold text-lg transition ${
                  applied
                    ? "bg-green-100 text-green-700 cursor-not-allowed"
                    : job.status !== "Open"
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-sky-600 text-white hover:bg-sky-700"
                }`}
              >
                {applied ? "Applied ✓" : applying ? "Applying..." : "Apply Now"}
              </button>

              {applied && (
                <button
                  onClick={() => handleWithdraw(job._id)}
                  className="w-full py-2 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700"
                >
                  Withdraw Application
                </button>
              )}

              <div className="mt-6 text-xs text-gray-500 text-center">
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;
