"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import SuperAdminSidebar from "@/components/AdminSidebar";
import AdminJobCard from "@/components/AdminJobcard";
import { Button } from "@/components/ui/button";
import { AppDispatch, Rootstate } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "@/store/slice/auth/auth";
import Loading from "@/components/Loading";
import { Job } from "@/app/user/Jobs/page";
import api from "@/utils/baseUrl";
import toast from "react-hot-toast";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
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
      const res = await api.get("superadmin/jobs", { withCredentials: true });
      setJobs(res.data.data);
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <AdminJobCard
                key={job._id}
                job={job}
                onView={() => router.push(`/admin/dashboard/jobs/${job._id}`)}
                onApprove={() => approveJob(job._id)}
                onReject={() => rejectJob(job._id)}
              />
            ))}
          </div>

          {/* Empty State */}
          {jobs.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              No jobs found
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;
