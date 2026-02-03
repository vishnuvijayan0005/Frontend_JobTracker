"use client";

import { useState } from "react";
import CompanySidebar from "./CompanySidebar";
import CompanyNavbar from "./CompanyNavbar";
import { Briefcase, Users, UserCheck2, XCircle } from "lucide-react";

export default function CompanyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sidebarMargin = collapsed ? "md:ml-20" : "md:ml-64";

  
  const statsData = [
    { title: "Active Jobs", value: "12", icon: <Briefcase className="h-5 w-5 text-blue-600" />, color: "blue" },
    { title: "Total Applicants", value: "248", icon: <Users className="h-5 w-5 text-green-600" />, color: "green" },
    { title: "Shortlisted", value: "36", icon: <UserCheck2 className="h-5 w-5 text-yellow-600" />, color: "yellow" },
    { title: "Rejected", value: "112", icon: <XCircle className="h-5 w-5 text-red-600" />, color: "red" },
  ];

  const recentJobs = [
    { title: "Frontend Developer", type: "Full-time", applicants: 45, status: "Active" },
    { title: "Backend Engineer", type: "Full-time", applicants: 60, status: "Active" },
    { title: "UI/UX Designer", type: "Contract", applicants: 18, status: "Shortlisted" },
    { title: "DevOps Engineer", type: "Full-time", applicants: 12, status: "Active" },
    { title: "Data Analyst", type: "Part-time", applicants: 30, status: "Rejected" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">

      
      <CompanySidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarMargin} ${sidebarOpen ? "pointer-events-none md:pointer-events-auto" : ""}`}>

        <CompanyNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            Welcome Back, Admin
          </h1>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 sm:mb-6">
            {statsData.map((stat, idx) => (
              <StatCard
                key={idx}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color as any}
              />
            ))}
          </div>

          {/* Recent Jobs Table */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-5 md:p-6 lg:p-8 overflow-x-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
              Recent Jobs
            </h2>
            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3 text-left font-medium text-gray-500 uppercase">
                    Job Title
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3 text-left font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3 text-left font-medium text-gray-500 uppercase">
                    Applicants
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3 text-left font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentJobs.map((job, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3 text-gray-700 font-medium">{job.title}</td>
                    <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3 text-gray-500">{job.type}</td>
                    <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3 text-gray-500">{job.applicants}</td>
                    <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3">
                      <span className={`px-2 py-0.5 text-xs sm:text-sm font-semibold rounded-full ${job.status === "Active" ? "bg-blue-600 text-white" : job.status === "Shortlisted" ? "bg-yellow-600 text-white" : "bg-red-600 text-white"}`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}


interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red";
}

function StatCard({ title, value, icon, color = "blue" }: StatCardProps) {
  const bgMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-5 rounded-xl shadow hover:shadow-md transition ${bgMap[color]}`}>
      <div className="p-2 sm:p-3 bg-white rounded-lg shadow">{icon}</div>
      <div className="flex-1">
        <p className="text-sm sm:text-base font-medium">{title}</p>
        <p className="text-lg sm:text-2xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}
