"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CompanySidebar from "./CompanySidebar";
import CompanyNavbar from "./CompanyNavbar";
import { Briefcase, UserCheck2, XCircle, Users2 } from "lucide-react";
import api from "@/utils/baseUrl";

/* ================= TYPES ================= */

interface Job {
  _id: string;
  title: string;
  jobType: string;
  status: "Open" | "Closed";
  createdAt: string;
}

interface DashboardData {
  totalJobs: number;
  totalActiveJobs: number;
  totalApplicants: number;
  shortlistedCandidates: number;
  rejectedCandidates: number;
  hiredCandidates: number;
  jobs: Job[];
}

type StatColor = "blue" | "green" | "yellow" | "red";

interface StatItem {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: StatColor;
}

/* ================= PAGE ================= */

export default function CompanyDashboard() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const sidebarMargin = collapsed ? "md:ml-20" : "md:ml-64";

  /* ================= FETCH DASHBOARD ================= */

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/companyadmin/getcompanydashboard", {
        withCredentials: true,
      });
      setDashboard(res.data.data);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ================= SEARCH ================= */

  const handleSearch = async (query: string) => {
    if (!query) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const res = await api.get("/companyadmin/fetchdashboardsearch", {
        params: { search: query },
        withCredentials: true,
      });
      setSearchResults(res.data.data.jobs || []);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  /* ================= STATS ================= */

  const statsData: StatItem[] = dashboard
    ? [
        {
          title: "Active Jobs",
          value: String(dashboard.totalActiveJobs ?? 0),
          icon: <Briefcase className="h-5 w-5 text-blue-600" />,
          color: "blue",
        },
        {
          title: "Total Applications",
          value: String(dashboard.totalApplicants ?? 0),
          icon: <Users2 className="h-5 w-5 text-green-600" />,
          color: "green",
        },
        {
          title: "Shortlisted",
          value: String(dashboard.shortlistedCandidates ?? 0),
          icon: <UserCheck2 className="h-5 w-5 text-yellow-600" />,
          color: "yellow",
        },
        {
          title: "Rejected",
          value: String(dashboard.rejectedCandidates ?? 0),
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          color: "red",
        },
      ]
    : [];

  const jobsToShow = isSearching ? searchResults : dashboard?.jobs || [];

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CompanySidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className={`flex-1 flex flex-col ${sidebarMargin}`}>
        <CompanyNavbar
          setSidebarOpen={setSidebarOpen}
          onSearch={handleSearch}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome Back, Admin</h1>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsData.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          {/* JOBS */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isSearching ? "Search Results" : "Recent Jobs"}
            </h2>

            {jobsToShow.length === 0 ? (
              <p className="text-gray-500 text-sm">
                {isSearching ? "No results found" : "No jobs posted yet"}
              </p>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Job Title</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobsToShow.map((job) => (
                    <tr
                      key={job._id}
                      onClick={() =>
                        router.push(`/companyadmin/myjob/${job._id}`)
                      }
                      className="border-t hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-2 font-medium">
                        {job.title}
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {job.jobType}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            job.status === "Open"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  title,
  value,
  icon,
  color = "blue",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: StatColor;
}) {
  const colors: Record<StatColor, string> = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${colors[color]}`}>
      <div className="p-3 bg-white rounded-lg shadow">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
