"use client";

import { Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
  onSearch: (query: string) => void;
}

export default function CompanyNavbar({
  setSidebarOpen,
  onSearch,
}: NavbarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [query]); // ✅ dependency ONLY on query

  return (
    <header className="h-16 bg-white border-b flex items-center px-4 md:px-6">
      {/* Mobile menu */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Search */}
      <div className="relative flex-1 mx-4 hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

        <input
          type="text"
          placeholder="Search jobs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm
                     focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </header>
  );
}
