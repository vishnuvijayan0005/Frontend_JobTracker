"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "lucide-react";

import SuperAdminSidebar from "@/components/AdminSidebar";
;
import Loading from "@/components/Loading";

import { fetchMe } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";
import { fetchCompanies } from "@/store/slice/company/companySlice";
import api from "@/utils/baseUrl";
import toast from "react-hot-toast";

export default function AdminCompaniesPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [showLoading, setShowLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth,
  );

  /* ================= AUTH ================= */
  useEffect(() => {
    dispatch(fetchMe());
   
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/access-denied");
      return;
    }

    const timer = setTimeout(() => setShowLoading(false), 300);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user, router]);

  if (loading || showLoading) {
    return (
      <div className="min-h-screen flex bg-slate-100">
        <SuperAdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex items-center justify-center">
          <Loading text="Loading..." />
        </div>
      </div>
    );
  }

  

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <SuperAdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col ">
        {/* ===== HEADER (MOBILE + DESKTOP) ===== */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-slate-100"
          >
            <Menu className="h-6 w-6 text-slate-700" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">
          Audit LOG
          </h1>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 px-8 py-5 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
                 Audit LOG
            </h1>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          </div>
        </main>
      </div>
    </div>
  );
}
