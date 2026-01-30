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
import Footer from "@/components/Footer";

export default function MyJobs() {
  const [jobs, setJobs] = useState<any[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle
  const [showLoading, setShowLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth,
  );
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== "companyadmin") {
        router.replace("/access-denied");
      } else {
        const timer = setTimeout(() => {
          setShowLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [loading, isAuthenticated, user, router]);

  const fetchJobs = async () => {
    setShowLoading(true);
    try {
      const res = await api.get(`/companyadmin/myjobs`, {
        withCredentials: true,
      });
      //  console.log(res.data.data);

      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <CompanySidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Optional mobile backdrop when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto relative z-10">
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <div className="flex items-center gap-2">
            {/* Mobile Add Job Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1 bg-sky-600 text-white px-3 py-1 rounded-lg hover:bg-sky-700"
            >
              <Plus className="h-4 w-4" /> Add Job
            </button>

            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <button
            className="bg-sky-600 text-white px-4 py-2 rounded-lg"
            onClick={() => setModalOpen(true)}
          >
            Add Job
          </button>
        </div>

        {/* Job List */}
        {loading ? (
          <Loading text="Loading jobs..." />
        ) : jobs.length === 0 ? (
          <p className="text-gray-500">No jobs found. Add one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm 
                 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Header */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 hover:text-sky-600 transition">
                    {job.title}
                  </h2>
                  {job.companyName && (
                    <p className="text-sm text-gray-500 mt-1">
                      {job.companyName}
                    </p>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">📍</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">💼</span>
                    <span>{job.jobType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <span>💰</span>
                    <span>{job.salary || "Not disclosed"}</span>
                  </div>
                </div>

       
                <div className="flex justify-between items-center mt-auto">
                  <button
                    className={`px-3 py-1 text-xs font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                      job.status?.toLowerCase() === "open"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                    onClick={async () => {
                      try {
                    
                        const newStatus =
                          job.status === "Open" ? "Closed" : "Open";
                        await api.patch(
                          `/companyadmin/job/${job._id}/status`,
                          { status: newStatus },
                          { withCredentials: true },
                        );
                        setJobs((prev) =>
                          prev.map((j) =>
                            j._id === job._id ? { ...j, status: newStatus } : j,
                          ),
                        );
                      } catch (err) {
                        console.error("Failed to update job status", err);
                      }
                    }}
                  >
                    {job.status || "Open"}
                  </button>

                  {/* CTA */}
                  <button
                    className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700 transition"
                    onClick={() => router.push(`/companyadmin/job/${job._id}`)}
                  >
                    See details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Job Modal */}
        <AddJobModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onJobAdded={fetchJobs} // refresh job list after adding
        />
      </div>
      <Footer/>
    </div>
  );
}
