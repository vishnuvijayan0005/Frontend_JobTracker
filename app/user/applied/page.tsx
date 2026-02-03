"use client";

import React, { useEffect, useState } from "react";
import UserNavbar from "@/components/UserNavbar";
import Footer from "@/components/Footer";
import { Briefcase, MapPin, CalendarCheck } from "lucide-react";
import { fetchMe } from "@/store/slice/auth/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, Rootstate } from "@/store/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/utils/baseUrl";
import Modal from "@/components/Modal";

/* ================= TYPES ================= */

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  appliedAt: string;
  status: "Applied" | "Under Review" | "Withdrawn";
}

/* ================= PAGE ================= */

const AppliedJobsPage = () => {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth,
  );

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [showLoading, setShowLoading] = useState(true);

  /* ================= AUTH ================= */

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "user") {
      router.replace("/access-denied");
      return;
    }

    const timer = setTimeout(() => setShowLoading(false), 500);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user, router]);

  /* ================= FETCH APPLIED JOBS ================= */

  
 const fetchAppliedJobs = async () => {
      try {
        const res = await api.get("/user/appliedjobs", {
          withCredentials: true,
        });
        setAppliedJobs(res.data.data);
      } catch {
        toast.error("Failed to load applied jobs");
      }
    };
useEffect(()=>{

    fetchAppliedJobs();
}
  , []);
  const [openModal, setOpenModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  /* ================= WITHDRAW ================= */

  const handleWithdraw = async (jobId: string) => {
 

    setWithdrawingId(jobId);

    try {
      await toast.promise(
        api.delete(
          `/user/withdrawapplication/${jobId}`,
          
          { withCredentials: true },
        ),
        {
          loading: "Withdrawing application...",
          success: "Application withdrawn",
          error: "Failed to withdraw",
        },
      );

      setAppliedJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "Withdrawn" } : job,
        ),
      );
      await fetchAppliedJobs();
    } finally {
      setWithdrawingId(null);
    }
  };

  /* ================= RENDER ================= */

  if (loading || showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading applied jobs…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserNavbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Applied Jobs</h1>
            <p className="text-gray-600 mt-2">
              Track and manage the jobs you’ve applied for
            </p>
          </div>

          {/* Empty State */}
          {appliedJobs.length === 0 && (
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                No applications yet
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Once you apply for jobs, they’ll appear here.
              </p>
            </div>
          )}

          {/* Jobs */}
          <div className="space-y-4">
            {appliedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* LEFT */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h2>
                    <p className="text-gray-600 mt-1">{job.companyName}</p>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarCheck size={16} />
                        Applied on{" "}
                        {new Date(job.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Status */}
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium
                        ${
                          job.status === "Under Review"
                            ? "bg-yellow-50 text-yellow-700"
                            : job.status === "Withdrawn"
                              ? "bg-red-50 text-red-600"
                              : "bg-sky-50 text-sky-700"
                        }`}
                    >
                      {job.status}
                    </span>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/user/jobsdetails/${job.id}`)
                        }
                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                      >
                        View Job
                      </button>

                      {job.status !== "Withdrawn" && (
                        <button
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setOpenModal(true);
                          }}
                          className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Modal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title="Withdraw Application"
          footer={
            <>
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedJobId) handleWithdraw(selectedJobId);
                  setOpenModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Withdraw
              </button>
            </>
          }
        >
          <p>
            Are you sure you want to withdraw this application? This action
            cannot be undone.
          </p>
        </Modal>
      </main>

      <Footer />
    </div>
  );
};

export default AppliedJobsPage;
