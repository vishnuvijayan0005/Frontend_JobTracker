"use client";

import { useEffect, useState } from "react";
import CompanySidebar from "@/components/CompanySidebar";
import { Mail, FileText, Menu, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/utils/baseUrl";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, Rootstate } from "@/store/store";
import { fetchMe } from "@/store/slice/auth/auth";
import ScheduleInterviewModal from "@/components/Shortlistedmodl";



interface Applicant {
  id: string;
  name: string;
  email: string;
  resumeUrl?: string;
}

interface JobGroup {
  jobId: string;
  title: string;
  applicants: Applicant[];
}

export default function ShortlistedApplicantsPage() {
  const [jobs, setJobs] = useState<JobGroup[]>([]);
  const [openJobs, setOpenJobs] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
        const timer = setTimeout(() => setShowLoading(false), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, isAuthenticated, user, router]);

  const toggleJob = (jobId: string) => {
    setOpenJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const fetchApplicants = async () => {
    setShowLoading(true);
    try {
      const res = await api.get("/companyadmin/getshortlisted", {
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
        });
      });

      setJobs(Array.from(grouped.values()));
    } catch (err) {
      console.error("Failed to fetch shortlisted applicants", err);
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleScheduleInterview = async (data: any) => {
    if (!selectedApplicant) return;

    await api.post(
      "/companyadmin/schedule-interview",
      { applicationId: selectedApplicant, ...data },
      { withCredentials: true }
    );

    await api.patch(
      "/companyadmin/updateApplicationStatus",
      { applicationId: selectedApplicant, status: "interview" },
      { withCredentials: true }
    );

    setShowModal(false);
    setSelectedApplicant(null);
    fetchApplicants();
  };

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
            className="p-2 rounded-lg border bg-white"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold">Shortlisted Applicants</h1>
        </div>

        {/* Desktop Header */}
        <h1 className="hidden md:block text-2xl font-bold mb-8">
          Shortlisted Applicants
        </h1>

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center">No shortlisted applicants found.</p>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.jobId} className="bg-white rounded-2xl shadow-sm">
                {/* Job Header */}
                <button
                  onClick={() => toggleJob(job.jobId)}
                  className="w-full flex justify-between items-center px-6 py-4 bg-gray-100 rounded-t-2xl hover:bg-gray-200 transition"
                >
                  <h2 className="font-semibold">{job.title}</h2>
                  {openJobs.includes(job.jobId) ? <ChevronUp /> : <ChevronDown />}
                </button>

                {/* Applicants List */}
                {openJobs.includes(job.jobId) &&
                  job.applicants.map((applicant) => (
                    <div
                      key={applicant.id}
                      className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t"
                    >
                      <div>
                        <h3 className="font-semibold">{applicant.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail size={14} /> {applicant.email}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedApplicant(applicant.id);
                            setShowModal(true);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Schedule Interview
                        </button>

                        {applicant.resumeUrl && (
                          <button
                            onClick={() =>
                              window.open(applicant.resumeUrl, "_blank")
                            }
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                          >
                            <FileText size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </main>

     
      <ScheduleInterviewModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedApplicant(null);
        }}
        onConfirm={handleScheduleInterview}
      />
    </div>
  );
}
