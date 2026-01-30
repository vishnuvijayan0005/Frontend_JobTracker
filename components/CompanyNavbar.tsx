"use client";

import { Menu, Bell } from "lucide-react";

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function CompanyNavbar({ setSidebarOpen }: NavbarProps) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <input
        type="text"
        placeholder="Search jobs or applicants..."
        className="flex-1 mx-4 p-2 border rounded-lg text-sm hidden sm:block"
      />

      <div className="flex items-center gap-4">
        <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
        <div className="h-8 w-8 rounded-full bg-slate-200" />
      </div>
    </header>
  );
}
