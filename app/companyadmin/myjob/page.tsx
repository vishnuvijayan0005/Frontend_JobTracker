"use client";

import { useEffect, useState } from "react";
import api from "@/utils/baseUrl";
import Loading from "@/components/Loading";
import AddJobModal from "@/components/Addjob";
import CompanySidebar from "@/components/CompanySidebar";

import { Menu, Plus } from "lucide-react";
import { fetchMe } from "@/store/slice/auth/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, Rootstate } from "@/store/store";
import { useRouter } from "next/navigation";

export default function MyJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [collapsed, setCollapsed] = useState(false); 
  const [showLoading, setShowLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );


  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);


  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== "companyadmin") {
        router.replace("/access-denied");
      } else {
        const timer = setTimeout(() => setShowLoading(false), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, isAuthenticated, user, router]);

  const fetchJobs = async () => {
    setShowLoading(true);
    try {
      const res = await api.get(`/companyadmin/myjobs`, { withCredentials: true });
      if (res.data.success) setJobs(res.data.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading || showLoading) return <Loading text="Fetching your data..." />;

  const sidebarMargin = collapsed ? "md:ml-20" : "md:ml-64";

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <CompanySidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarMargin} relative z-10`}
      >
        {/* Mobile Header */}
        <div className="flex items-center mb-4 md:hidden p-4 bg-white shadow">
         
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md  border hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page Title */}
          <h1 className="text-xl font-bold flex-1">My Jobs</h1>

          {/* Add Job Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 bg-sky-600 text-white px-3 py-1 rounded-md hover:bg-sky-700 text-sm"
          >
            <Plus className="h-4 w-4" /> Add Job
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center mb-6 px-6 lg:px-8">
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <button
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
            onClick={() => setModalOpen(true)}
          >
            Add Job
          </button>
        </div>

        {/* Job Cards */}
        {jobs.length === 0 ? (
          <p className="text-gray-500 px-6 lg:px-8">No jobs found. Add one!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-4 sm:px-6 lg:px-8">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Header */}
                <div className="mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 hover:text-sky-600 transition">
                    {job.title}
                  </h2>
                  {job.companyName && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{job.companyName}</p>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-col gap-1 text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                  <div className="flex items-center gap-1"><span>📍</span>{job.location}</div>
                  <div className="flex items-center gap-1"><span>💼</span>{job.jobType}</div>
                  <div className="flex items-center gap-1 font-medium"><span>💰</span>{job.salary || "Not disclosed"}</div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-auto gap-2 sm:gap-0">
                  <button
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                      job.status?.toLowerCase() === "open"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                    onClick={async () => {
                      try {
                        const newStatus = job.status === "Open" ? "Closed" : "Open";
                        await api.patch(
                          `/companyadmin/job/${job._id}/status`,
                          { status: newStatus },
                          { withCredentials: true }
                        );
                        setJobs((prev) =>
                          prev.map((j) =>
                            j._id === job._id ? { ...j, status: newStatus } : j
                          )
                        );
                      } catch (err) {
                        console.error("Failed to update job status", err);
                      }
                    }}
                  >
                    {job.status || "Open"}
                  </button>

                  <button
                    className="flex items-center gap-1 text-xs sm:text-sm font-medium text-sky-600 hover:text-sky-700 transition"
                    onClick={() => router.push(`/companyadmin/myjob/${job._id}`)}
                  >
                    See details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

       
        <AddJobModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onJobAdded={fetchJobs}
        />
      </div>
    </div>
  );
}
