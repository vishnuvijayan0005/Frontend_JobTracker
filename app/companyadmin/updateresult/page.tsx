"use client";

import { useEffect, useState } from "react";
import CompanySidebar from "@/components/CompanySidebar";
import { Mail, FileText, Menu, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/utils/baseUrl";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, Rootstate } from "@/store/store";
import { fetchMe } from "@/store/slice/auth/auth";



interface Applicant {
  id: string;
  name: string;
  email: string;
  resumeUrl?: string;
  result?: "hired" | "rejected" | "";
  resultNote?: string;
}

interface JobGroup {
  jobId: string;
  title: string;
  applicants: Applicant[];
}


export default function UpdateResultPage() {
  const [jobs, setJobs] = useState<JobGroup[]>([]);
  const [openJobs, setOpenJobs] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
        const timer = setTimeout(() => setShowLoading(false), 500);
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



  const fetchApplicants = async () => {
    setShowLoading(true);
    try {
      const res = await api.get("/companyadmin/getinterviewapplicants", {
        withCredentials: true,
      });

      const grouped = new Map<string, JobGroup>();
      res.data.data.forEach((app: any) => {
        if (!grouped.has(app.jobId)) {
          grouped.set(app.jobId, {
            jobId: app.jobId,
            title: app.jobTitle,
            applicants: [],
          });
        }

        grouped.get(app.jobId)!.applicants.push({
          id: app.applicationId,
          name: app.applicant.name,
          email: app.applicant.email,
          resumeUrl: app.resumeUrl,
          result: "",
          resultNote: "",
        });
      });

      setJobs(Array.from(grouped.values()));
    } catch (err) {
      console.error("Failed to fetch interview applicants", err);
    } finally {
      setShowLoading(false);
    }
  };

  const updateInterviewResult = async (
    applicationId: string,
    result: "hired" | "rejected",
    resultNote: string,
  ) => {
    try {
      setUpdating(true);
      await api.patch(
        "/companyadmin/update-interview-result",
        { applicationId, result, resultNote },
        { withCredentials: true },
      );
      setJobs((prev) =>
        prev.map((job) => ({
          ...job,
          applicants: job.applicants.map((app) =>
            app.id === applicationId ? { ...app, result, resultNote } : app,
          ),
        })),
      );
      fetchApplicants();
    } catch (err) {
      console.error("Failed to update interview result", err);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const sidebarMargin = sidebarCollapsed ? "md:ml-20" : "md:ml-64";

  if (loading || showLoading) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <CompanySidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 p-4 md:p-6 lg:p-10 overflow-auto ${sidebarMargin}`}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 mb-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md  border hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold">Interview Results</h1>
        </div>

        {/* Desktop Header */}
        <h1 className="hidden md:block text-2xl font-bold mb-6">Interview Results</h1>

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center">No interview applicants found.</p>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.jobId} className="bg-white rounded-2xl shadow-sm">
                <button
                  onClick={() => toggleJob(job.jobId)}
                  className="w-full flex justify-between items-center px-6 py-4 bg-gray-100 rounded-t-2xl hover:bg-gray-200 transition"
                >
                  <h2 className="font-semibold">{job.title}</h2>
                  {openJobs.includes(job.jobId) ? <ChevronUp /> : <ChevronDown />}
                </button>

                {openJobs.includes(job.jobId) &&
                  job.applicants.map((applicant) => (
                    <div
                      key={applicant.id}
                      className="px-6 py-4 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      {/* Applicant Info */}
                      <div>
                        <h3 className="font-semibold">{applicant.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail size={14} /> {applicant.email}
                        </p>
                      </div>

                      {applicant.resumeUrl && (
                        <button
                          onClick={() => window.open(applicant.resumeUrl, "_blank")}
                          className="px-4 py-2 border rounded-lg"
                        >
                          <FileText size={16} />
                        </button>
                      )}

                      {/* Result Update */}
                      <div className="flex flex-col md:flex-row gap-3 flex-1">
                        <select
                          value={applicant.result || ""}
                          onChange={(e) =>
                            setJobs((prev) =>
                              prev.map((job) => ({
                                ...job,
                                applicants: job.applicants.map((app) =>
                                  app.id === applicant.id
                                    ? { ...app, result: e.target.value as "hired" | "rejected" }
                                    : app
                                ),
                              }))
                            )
                          }
                          className="border rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="">Select Result</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Result note (optional)"
                          value={applicant.resultNote || ""}
                          onChange={(e) =>
                            setJobs((prev) =>
                              prev.map((job) => ({
                                ...job,
                                applicants: job.applicants.map((app) =>
                                  app.id === applicant.id
                                    ? { ...app, resultNote: e.target.value }
                                    : app
                                ),
                              }))
                            )
                          }
                          className="flex-1 border rounded-lg px-3 py-2 text-sm"
                        />

                        <button
                          disabled={!applicant.result || updating}
                          onClick={() =>
                            updateInterviewResult(
                              applicant.id,
                              applicant.result as "hired" | "rejected",
                              applicant.resultNote || "",
                            )
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
