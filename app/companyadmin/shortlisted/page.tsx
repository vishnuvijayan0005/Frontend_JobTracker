"use client";

import { useEffect, useState } from "react";
import CompanySidebar from "@/components/CompanySidebar";
import { Mail, FileText, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/utils/baseUrl";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, Rootstate } from "@/store/store";
import { fetchMe } from "@/store/slice/auth/auth";
import ScheduleInterviewModal from "@/components/Shortlistedmodl";

/* ================= TYPES ================= */

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

export default function ShotlistedApplicantsPage() {
  const [jobs, setJobs] = useState<JobGroup[]>([]);
  const [openJobs, setOpenJobs] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "companyadmin")) {
      router.replace("/access-denied");
    }
  }, [loading, isAuthenticated, user, router]);

  const toggleJob = (jobId: string) => {
    setOpenJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const fetchApplicants = async () => {
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
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleScheduleInterview = async (data: any) => {
    // console.log(data);
    
    await api.post(
      "/companyadmin/schedule-interview",
      {
        applicationId: selectedApplicant,
        ...data,
      },
      { withCredentials: true }
    );
     await api.patch(
        "/companyadmin/updateApplicationStatus",
        { applicationId:selectedApplicant, status: "interview" },
        { withCredentials: true },
      );

    setShowModal(false);
    setSelectedApplicant(null);
    fetchApplicants()
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CompanySidebar isOpen={false} setIsOpen={() => {}} />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Shortlisted Applicants</h1>

        {jobs.map((job) => (
          <div key={job.jobId} className="bg-white rounded-xl mb-4">
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
                  className="px-6 py-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{applicant.name}</h3>
                    <p className="text-sm text-gray-500 flex gap-1">
                      <Mail size={14} /> {applicant.email}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedApplicant(applicant.id);
                        setShowModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Schedule Interview
                    </button>

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
                </div>
              ))}
          </div>
        ))}
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
