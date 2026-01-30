"use client";

import { useState } from "react";
import CompanySidebar from "@/components/CompanySidebar";
import { Menu } from "lucide-react";
import { Mail, Phone, FileText } from "lucide-react";

const dummyApplicants = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "9876543210",
    jobTitle: "Frontend Developer",
    experience: "2 Years",
    status: "Pending",
  },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Shortlisted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function ApplicantsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <CompanySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
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

        {/* Desktop Title */}
        <h1 className="hidden md:block text-2xl font-bold mb-6">
          Applicants
        </h1>

        <div className="space-y-4">
          {dummyApplicants.map((applicant) => (
            <div
              key={applicant.id}
              className="bg-white border rounded-2xl p-5 flex flex-col md:flex-row md:justify-between gap-4"
            >
              <div>
                <h2 className="font-semibold">{applicant.name}</h2>
                <p className="text-sm text-gray-500">
                  Applied for {applicant.jobTitle}
                </p>

                <div className="flex gap-4 text-sm mt-2 text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {applicant.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={14} /> {applicant.phone}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[applicant.status]}`}
                >
                  {applicant.status}
                </span>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
                  <FileText size={16} /> Resume
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
