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
      } catch (error) {
        toast.error("Failed to load job details");
      }
    };

    fetchJob();
  }, [id]);

  /* ================= STATES ================= */

  if (loading || showLoading) {
    return <Loading text="Fetching job details..." />;
  }

  if (!job) {
    return <p className="text-center mt-10">Job not found</p>;
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
 <div className="max-w-6xl mx-auto px-4 pt-6">
      {/* Back Button */}
      <BackButton label="Jobs" />
    </div>
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
                💰 {job.salary}
              </span>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2 className="text-xl font-semibold mb-4">
              About the role
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
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
          {job.benefits?.length > 0 && (
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
          {job.tags?.length > 0 && (
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
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-24">
            <p className="text-sm text-gray-500 mb-2">Job Status</p>

            <p
              className={`font-semibold mb-6 ${
                job.status === "Open"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {job.status}
            </p>

            <button
              className="w-full py-3 rounded-xl bg-sky-600 text-white font-semibold text-lg hover:bg-sky-700 transition"
              onClick={() =>
                toast.success("Applied (connect backend later)")
              }
            >
              Apply Now
            </button>

            <button
              className="w-full py-3 mt-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              onClick={() => toast.success("Saved for later")}
            >
              Save for Later
            </button>

            <div className="mt-6 text-xs text-gray-500">
              Posted on{" "}
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Page;
