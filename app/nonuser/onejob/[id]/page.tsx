"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import api from "@/utils/baseUrl";
import Loading from "@/components/Loading";
import UserNavbar from "@/components/UserNavbar";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

/* ================= TYPES ================= */

interface Job {
  _id: string;

  title: string;
  company: string;
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
  jobMode: "Onsite" | "Remote" | "Hybrid";

  salary: string;

  status: "Open" | "Closed";
  forcedclose: boolean;

  createdAt: string;
  updatedAt: string;
}

/* ================= PAGE ================= */

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [showLoading, setShowLoading] = useState(true);
  const [job, setJob] = useState<Job | null>(null);

  /* ================= FETCH JOB ================= */

  useEffect(() => {
    if (!id) {
      setShowLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        const res = await api.get(`/user/jobsdetails/${id}/nonuser`, {
          withCredentials: true,
        });
        setJob(res.data.data);
      } catch (error) {
        toast.error("Failed to load job details");
        setJob(null);
      } finally {
        setShowLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  /* ================= STATES ================= */

  if (showLoading) {
    return <Loading text="Fetching job details..." />;
  }

  if (!job) {
    return <p className="text-center mt-10">Job not found</p>;
  }

  const isClosed = job.status !== "Open" || job.forcedclose;

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-6">
        <BackButton label="Jobs" />
      </div>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {job.title}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {job.companyName}
              </p>

              <div className="flex flex-wrap gap-3 mt-5 text-sm">
                <span className="px-3 py-1 rounded-full bg-gray-100">
                  📍 {job.location}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100">
                  🧑‍💼 {job.experience} years
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100">
                  🎯 {job.seniorityLevel}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100">
                  💼 {job.jobType}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100">
                  🏢 {job.jobMode}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100">
                  💰 {job.salary}
                </span>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-4">
                About the role
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-xl font-semibold mb-4">
                  Requirements
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {job.requirements}
                </p>
              </div>
            )}

            {/* Qualifications */}
            {job.qualifications && (
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-xl font-semibold mb-4">
                  Qualifications
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {job.qualifications}
                </p>
              </div>
            )}

            {/* Skills */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 rounded-full bg-sky-50 text-sky-700 text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            {job.benefits.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-xl font-semibold mb-4">
                  Benefits
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {job.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Interview Process */}
            {job.interviewProcess && (
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-xl font-semibold mb-4">
                  Interview Process
                </h2>
                <p className="text-gray-700">
                  {job.interviewProcess}
                </p>
              </div>
            )}

            {/* Tags */}
            {job.tags.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-xl font-semibold mb-4">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT ================= */}
          <div>
            <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-24">
              <p className="text-sm text-gray-500 mb-2">
                Job Status
              </p>

              <p
                className={`font-semibold mb-6 ${
                  job.forcedclose
                    ? "text-red-700"
                    : job.status === "Open"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {job.forcedclose ? "Closed by Admin" : job.status}
              </p>

              <button
                disabled={isClosed}
                onClick={() =>
                  toast.error(
                    "You haven't logged in yet. Please login to apply."
                  )
                }
                className={`w-full py-3 rounded-xl font-semibold text-lg transition
                  ${
                    isClosed
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-sky-600 text-white hover:bg-sky-700"
                  }
                `}
              >
                {job.forcedclose ? "Job Closed" : "Apply"}
              </button>

              <div className="mt-6 text-xs text-gray-500 text-center space-y-1">
                <p>
                  Posted on{" "}
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Last updated on{" "}
                  {new Date(job.updatedAt).toLocaleDateString()}
                </p>
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
