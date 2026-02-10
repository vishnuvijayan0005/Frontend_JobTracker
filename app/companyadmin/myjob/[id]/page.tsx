"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { Menu, Pencil } from "lucide-react";

import api from "@/utils/baseUrl";
import Loading from "@/components/Loading";
import { fetchMe } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";
import BackButton from "@/components/BackButton";
import CompanySidebar from "@/components/CompanySidebar";
import AddJobModal from "@/components/Addjob";
import axios, { AxiosError } from "axios";


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
  jobMode:string;
  experience: string;
  seniorityLevel: string;
  skills: string[];
  benefits: string[];
  tags: string[];
  jobType: string;
  salary?: string;
  status: string;
  createdAt: string;
  totalApplicants: number;
}

/* ================= PAGE ================= */

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );

  const [showLoading, setShowLoading] = useState(true);
  const [job, setJob] = useState<Job | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  /* ================= AUTH ================= */

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "companyadmin") {
      router.replace("/access-denied");
      return;
    }

    const timer = setTimeout(() => setShowLoading(false), 500);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user, router]);

  /* ================= FETCH JOB ================= */

  const fetchJob = async () => {
    try {
      const res = await api.get(`/companyadmin/jobsdetails/${id}`, {
        withCredentials: true,
      });
      setJob(res.data.data);
    } catch {
      toast.error("Failed to load job details");
    }
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  /* ================= STATUS ================= */

const toggleStatus = async () => {
  if (!job || updatingStatus) return;

  const newStatus = job.status === "Open" ? "Closed" : "Open";
  setUpdatingStatus(true);

  try {
   const res= await api.patch(
      `/companyadmin/job/${job._id}/status`,
      { status: newStatus },
      { withCredentials: true }
    );

    setJob((prev) => (prev ? { ...prev, status: newStatus } : prev));
    
  } catch (error){

   
    
    
    toast.error("You can’t update this job’s status,please contact admin");
  } finally {

    setTimeout(() => {
      setUpdatingStatus(false);
    }, 50);
  }
};


  /* ================= LOADING ================= */

  if (loading || showLoading) {
  return (
    <div className="min-h-screen flex">
      
     
      <CompanySidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex-1 flex items-center justify-center">
        <Loading text="Loading ..." />
      </div>
    </div>
  );
}

  if (!job) {
    return <p className="text-center mt-10">Job not found</p>;
  }

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CompanySidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex-1 flex flex-col transition-all ${
          collapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-white border-b">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-semibold">Job Details</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-6">
          <BackButton label="Jobs" />
        </div>

        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm p-8 flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  <p className="text-gray-600 mt-2">{job.companyName}</p>
                </div>

                {/* EDIT BUTTON */}
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Job
                </button>
              </div>

              <Section title="About the role" content={job.description} />
              {job.requirements && (
                <Section title="Requirements" content={job.requirements} />
              )}
              {job.qualifications && (
                <Section title="Qualifications" content={job.qualifications} />
              )}
              {job.interviewProcess && (
                <Section title="Interview Process" content={job.interviewProcess} />
              )}
            </div>

            {/* RIGHT */}
            <div className="bg-white rounded-3xl shadow-sm p-6 lg:sticky lg:top-24 space-y-4">
              <Meta label="Location" value={job.location} />
              <Meta label="Experience" value={job.experience} />
              <Meta label="Seniority Level" value={job.seniorityLevel} />
              <Meta label="Job Type" value={job.jobType} />
               <Meta label="Job Type" value={job.jobMode} />
              {job.salary && <Meta label="Salary" value={job.salary} />}

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">Total Applicants</p>
                <p className="text-2xl font-bold">{job.totalApplicants}</p>
              </div>

              <button
                onClick={() => router.push(`/companyadmin/applicants?jobId=${job._id}`)}
                className="w-full px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700"
              >
                View Applicants
              </button>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-1">Job Status</p>
                <button
                  onClick={toggleStatus}
                  disabled={updatingStatus}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    job.status === "Open"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.status}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* EDIT MODAL */}
      <AddJobModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onJobAdded={fetchJob}
        mode="edit"
        initialData={job}
      />

    </div>
  );
};



const Section = ({ title, content }: { title: string; content: string }) => (
  <div className="bg-white rounded-3xl shadow-sm p-8">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <p className="text-gray-700 whitespace-pre-line">{content}</p>
  </div>
);

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default Page;
