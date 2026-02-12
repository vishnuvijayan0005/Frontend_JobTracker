"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Menu, XCircle } from "lucide-react";

import SuperAdminSidebar from "@/components/AdminSidebar";
import AdminJobCard from "@/components/AdminJobcard";
import { Button } from "@/components/ui/button";
import { AppDispatch, Rootstate } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "@/store/slice/auth/auth";
import Loading from "@/components/Loading";

import api from "@/utils/baseUrl";
import toast from "react-hot-toast";
import AddJobModal from "@/components/Addjob";
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
  updatedAt: string;
  forcedclose: boolean;
  jobMode:string;
}
const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
 const [editOpen, setEditOpen] = useState(false);
  const params = useParams();

  const id = params?.id as string;
  const approveJob = async (id: string) => {
    const res = await api.patch(
      `/superadmin/jobs/${id}/forced`,
      { status: false },
      { withCredentials: false },
    );
    fetchJobs();
    toast.success(res.data.message);
  };

  const rejectJob = async (id: string) => {
    const res = await api.patch(
      `/superadmin/jobs/${id}/forced`,
      { status: true },
      { withCredentials: false },
    );
    fetchJobs();
    toast.success(res.data.message);
  };
  const router = useRouter();
  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [showLoading, setShowLoading] = useState(true);
  const fetchJobs = async () => {
    try {
      const res = await api.get(`superadmin/jobs/${id}`, {
        withCredentials: true,
      });
  
      setJob(res.data.data);
    } catch (error) {
      console.error(error, "----jobs");
    }
  };
  useEffect(() => {
    dispatch(fetchMe());
    fetchJobs();
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/access-denied");
      return;
    }

    const timer = setTimeout(() => setShowLoading(false), 400);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user, router]);

  if (loading || showLoading) {
    return (
      <div className="min-h-screen flex">
        <SuperAdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex items-center justify-center">
          <Loading text="Loading ..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <SuperAdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-slate-100"
          >
            <Menu className="h-6 w-6 text-slate-700" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">
            Job Management
          </h1>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block bg-white border-b border-slate-200 px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Job Management
              </h1>
              <p className="text-sm text-slate-500">
                Review, approve, and manage job postings
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
      <main className="flex-1 p-6 lg:p-10 bg-slate-50">
  <div className="max-w-6xl mx-auto space-y-8">

    {/* Back Button */}
    <div>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={18} />
        Back to Jobs
      </button>
    </div>

    {job && (
      <>
        {/* ===== Admin Control Bar ===== */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* Title Section */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {job.title}
            </h2>
            <p className="text-slate-500 mt-1">
              {job.companyName}
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span
                className={`px-4 py-1.5 text-xs rounded-full font-semibold ${
                  job.status === "Open"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {job.status}
              </span>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  job.forcedclose
                    ? "bg-red-50 text-red-600"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {job.forcedclose ? "Force Closed" : "Active"}
              </span>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
                   onClick={() => setEditOpen(true)}
              variant="outline"
            >
              Edit Job
            </Button>

           
            
             {job.forcedclose ? (
            <button
            onClick={() => approveJob(job._id)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium
               rounded-xl bg-green-600 text-white
               hover:bg-green-700 transition shadow-sm"
            >
              <CheckCircle className="h-4 w-4" />
              Admin Open
            </button>
          ) : (
            <button
               onClick={() => rejectJob(job._id)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium
               rounded-xl bg-red-600 text-white
               hover:bg-red-700 transition shadow-sm"
            >
              <XCircle className="h-4 w-4" />
              Admin Close
            </button>
          )}
          </div>
        </div>

        {/* ===== Job Overview ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Job Description
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills?.length ? (
                  job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">
                    No skills listed
                  </p>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Benefits
              </h3>
              {job.benefits?.length ? (
                <ul className="space-y-2 text-slate-600 text-sm">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-emerald-500">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-sm">
                  No benefits listed
                </p>
              )}
            </div>
          </div>

          {/* Right Sidebar (Admin Info Panel) */}
          <div className="space-y-6">

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">
                Job Information
              </h3>

              <div className="space-y-4 text-sm">
                <Info label="Location" value={job.location} />
                <Info label="Job Type" value={job.jobType} />
                <Info label="Seniority Level" value={job.seniorityLevel} />
                <Info label="Experience" value={job.experience} />
                <Info label="Salary" value={job.salary} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-xs text-slate-500 space-y-2">
              <p>Created: {new Date(job.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(job.updatedAt).toLocaleString()}</p>
              <p>Job ID: {job._id}</p>
            </div>

          </div>
        </div>
      </>
    )}
  </div>
</main>

      </div>
       <AddJobModal
              isOpen={editOpen}
              onClose={() => setEditOpen(false)}
              onJobAdded={fetchJobs}
              mode="edit"
              initialData={job}
            />
    </div>
  );
};
const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-slate-500 text-xs uppercase tracking-wide">{label}</p>
    <p className="font-medium text-slate-800 mt-1">
      {value || "Not specified"}
    </p>
  </div>
);

export default Page;
