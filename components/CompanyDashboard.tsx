"use client";

import { useState } from "react";
import CompanySidebar from "./CompanySidebar";
import CompanyNavbar from "./CompanyNavbar";

export default function CompanyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <CompanySidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <CompanyNavbar setSidebarOpen={setSidebarOpen} />

        {/* Dashboard content */}
        <main className="p-4 md:p-6 flex-1 overflow-auto">
          <h1 className="text-2xl font-semibold mb-6">Company Dashboard</h1>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Active Jobs" value="12" />
            <StatCard title="Total Applicants" value="248" />
            <StatCard title="Shortlisted" value="36" />
            <StatCard title="Rejected" value="112" />
          </div>

          {/* Example Job Table / Recent Jobs */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Jobs</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>Frontend Developer – React, Full-time</li>
              <li>Backend Engineer – Node.js, Full-time</li>
              <li>UI/UX Designer – Contract</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
