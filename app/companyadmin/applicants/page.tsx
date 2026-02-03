"use client";

import { useEffect, useState } from "react";
import CompanySidebar from "@/components/CompanySidebar";
import { Menu, Mail, FileText, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/utils/baseUrl";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, Rootstate } from "@/store/store";
import { fetchMe } from "@/store/slice/auth/auth";

/* ================= TYPES ================= */

interface Applicant {
  id: string;
  name: string;
  email: string;
  status: string;
  resumeUrl?: string;
  appliedAt: string;
}

interface JobGroup {
  jobId: string;
  title: string;
  applicants: Applicant[];
}

/* ================= STATUS CONFIG ================= */

const STATUS_OPTIONS = [
  "applied",
  "reviewing",
  "shortlisted",
  "interview",
  "rejected",
  "hired",
];

const statusStyles: Record<string, string> = {
  applied: "bg-yellow-100 text-yellow-700",
  reviewing: "bg-blue-100 text-blue-700",
  shortlisted: "bg-green-100 text-green-700",
  interview: "bg-purple-100 text-purple-700",
  rejected: "bg-red-100 text-red-700",
  hired: "bg-emerald-100 text-emerald-700",
};

/* ================= PAGE ================= */

export default function ApplicantsPage() {
  const [jobs, setJobs] = useState<JobGroup[]>([]);
  const [openJobs, setOpenJobs] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    applicationId: string;
    jobId: string;
    status: string;
  } | null>(null);

  // 🔹 Filter state
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Redux auth
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
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, isAuthenticated, user, router]);

  const toggleJob = (jobId: string) => {
    setOpenJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId],
    );
  };

  const groupByJob = (applications: any[]): JobGroup[] => {
    const map = new Map<string, JobGroup>();

    applications.forEach((app) => {
      if (!map.has(app.jobId)) {
        map.set(app.jobId, {
          jobId: app.jobId,
          title: app.jobTitle,
          applicants: [],
        });
      }

      map.get(app.jobId)!.applicants.push({
        id: app.applicationId,
        name: app.applicant.name,
        email: app.applicant.email,
        status: app.status,
        resumeUrl: app.resumeUrl,
        appliedAt: app.appliedAt,
      });
    });

    return Array.from(map.values());
  };

  /* ================= API ================= */

  const fetchApplicants = async () => {
    try {
      const res = await api.get("/companyadmin/getapplicants", {
        withCredentials: true,
      });
      // console.log(res.data.data);
      
      setJobs(groupByJob(res.data.data));
    } catch (err) {
      console.error("Failed to fetch applicants", err);
    } finally {
      setShowLoading(false);
    }
  };

  const updateStatus = async (
    applicationId: string,
    newStatus: string,
    jobId: string,
  ) => {
    try {
      setUpdating(true);

      await api.patch(
        "/companyadmin/updateApplicationStatus",
        { applicationId, status: newStatus },
        { withCredentials: true },
      );

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.jobId !== jobId
            ? job
            : {
                ...job,
                applicants: job.applicants.map((app) =>
                  app.id === applicationId
                    ? { ...app, status: newStatus }
                    : app,
                ),
              },
        ),
      );
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setUpdating(false);
      setEditingAppId(null);
      setConfirmData(null);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CompanySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-6 md:p-8">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 mb-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg border bg-white"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold">Applicants</h1>
        </div>

        <h1 className="hidden md:block text-2xl font-bold mb-4">Applicants</h1>

        {/* Filter */}
        <div className="mb-4 flex items-center gap-3">
          <label htmlFor="statusFilter" className="font-medium">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="all">All</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {showLoading ? (
          <p className="text-center text-gray-500">Loading applicants...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500">No applicants yet</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.jobId} className="bg-white rounded-2xl shadow-sm">
                <button
                  onClick={() => toggleJob(job.jobId)}
                  className="w-full flex justify-between items-center px-6 py-4 bg-gray-100 hover:bg-gray-200"
                >
                  <h2 className="font-semibold">{job.title}</h2>
                  {openJobs.includes(job.jobId) ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>

                {openJobs.includes(job.jobId) && (
                  <div className="divide-y">
                    {job.applicants
                      .filter((applicant) =>
                        statusFilter === "all"
                          ? true
                          : applicant.status === statusFilter,
                      )
                      .map((applicant) => (
                        <div
                          key={applicant.id}
                          className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                          <div>
                            <h3 className="font-semibold">{applicant.name}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail size={14} /> {applicant.email}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setEditingAppId(
                                    editingAppId === applicant.id
                                      ? null
                                      : applicant.id,
                                  )
                                }
                                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                  statusStyles[applicant.status]
                                }`}
                              >
                                {applicant.status}
                              </button>

                              {editingAppId === applicant.id && (
                                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-xl z-50">
                                  {STATUS_OPTIONS.map((status) => (
                                    <button
                                      key={status}
                                      disabled={updating}
                                      onClick={() =>
                                        setConfirmData({
                                          applicationId: applicant.id,
                                          jobId: job.jobId,
                                          status,
                                        })
                                      }
                                      className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-100 ${
                                        status === applicant.status
                                          ? "font-semibold text-blue-600 bg-gray-50"
                                          : ""
                                      }`}
                                    >
                                      {status}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {applicant.resumeUrl && (
                              <button
                                onClick={() =>
                                  window.open(applicant.resumeUrl, "_blank")
                                }
                                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
                              >
                                <FileText size={16} /> Resume
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Confirm Modal */}
      {confirmData && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl p-6 w-[320px] shadow-xl">
            <h3 className="font-semibold mb-2">Confirm Status Update</h3>
            <p className="text-sm text-gray-600 mb-4">
              Would you like to update application status to{" "}
              <span className="font-medium capitalize text-blue-600">
                {confirmData.status}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmData(null)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                No
              </button>
              <button
                disabled={updating}
                onClick={() =>
                  updateStatus(
                    confirmData.applicationId,
                    confirmData.status,
                    confirmData.jobId,
                  )
                }
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
