"use client";

import { Menu } from "lucide-react";

export default function SuperAdminNavbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md hover:bg-slate-100"
      >
        <Menu className="h-6 w-6" />
      </button>

      <h1 className="ml-4 text-lg font-semibold text-slate-800">
        Admin Panel
      </h1>
    </header>
  );
}
