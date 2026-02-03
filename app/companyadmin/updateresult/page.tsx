"use client";

import { useEffect, useState } from "react";
import CompanySidebar from "@/components/CompanySidebar";
import { Mail, FileText, ChevronDown, ChevronUp } from "lucide-react";
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
  resumeUrl?: string;
  result?: "hired" | "rejected" | "";
  resultNote?: string;
}

interface JobGroup {
  jobId: string;
  title: string;
  applicants: Applicant[];
}

/* ================= PAGE ================= */

export default function Updateresult() {
  const [jobs, setJobs] = useState<JobGroup[]>([]);
  const [openJobs, setOpenJobs] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth,
  );

  /* ================= AUTH ================= */

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "companyadmin")) {
      router.replace("/access-denied");
    }
  }, [loading, isAuthenticated, user, router]);

  /* ================= HELPERS ================= */

  const toggleJob = (jobId: string) => {
    setOpenJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId],
    );
  };

  /* ================= API ================= */

  const fetchApplicants = async () => {
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
// console.log(applicationId,result,resultNote,"--------");

      setJobs((prev) =>
        prev.map((job) => ({
          ...job,
          applicants: job.applicants.map((app) =>
            app.id === applicationId ? { ...app, result, resultNote } : app,
          ),
        })),
      );
      fetchApplicants()
    } catch (err) {
      console.error("Failed to update interview result", err);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CompanySidebar isOpen={false} setIsOpen={() => {}} />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Interview Results</h1>

        {jobs.map((job) => (
          <div key={job.jobId} className="bg-white rounded-xl mb-4 shadow-sm">
            <button
              onClick={() => toggleJob(job.jobId)}
              className="w-full flex justify-between px-6 py-4 bg-gray-100"
            >
              <h2 className="font-semibold">{job.title}</h2>
              {openJobs.includes(job.jobId) ? <ChevronUp /> : <ChevronDown />}
            </button>

            {openJobs.includes(job.jobId) &&
              job.applicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="px-6 py-4 border-t flex flex-col gap-3"
                >
                  {/* Applicant Info */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{applicant.name}</h3>
                      <p className="text-sm text-gray-500 flex gap-1">
                        <Mail size={14} /> {applicant.email}
                      </p>
                    </div>

                    {applicant.resumeUrl && (
                      <button
                        onClick={() =>
                          window.open(applicant.resumeUrl, "_blank")
                        }
                        className="px-4 py-2 border rounded-lg"
                      >
                        <FileText size={16} />
                      </button>
                    )}
                  </div>

                  {/* Result Update */}
                  <div className="flex flex-col md:flex-row gap-3">
                    <select
                      value={applicant.result || ""}
                      onChange={(e) =>
                        setJobs((prev) =>
                          prev.map((job) => ({
                            ...job,
                            applicants: job.applicants.map((app) =>
                              app.id === applicant.id
                                ? {
                                    ...app,
                                    result: e.target.value as
                                      | "hired"
                                      | "rejected",
                                  }
                                : app,
                            ),
                          })),
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
                                ? {
                                    ...app,
                                    resultNote: e.target.value,
                                  }
                                : app,
                            ),
                          })),
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
      </main>
    </div>
  );
}
