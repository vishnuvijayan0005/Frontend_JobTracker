"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Menu } from "lucide-react";
import toast from "react-hot-toast";

import SuperAdminSidebar from "@/components/AdminSidebar";
import Loading from "@/components/Loading";

import { fetchMe } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";
import api from "@/utils/baseUrl";
import AdminCompanyDetails from "@/components/AdminCompanyProfile";

export default function AdminCompanyViewPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const dispatch = useDispatch<AppDispatch>();

  const [showLoading, setShowLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [company, setCompany] = useState<any>(null);

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );

  /* ================= FETCH SINGLE COMPANY ================= */
  const fetchCompanyByOne = async () => {
    try {
      const res = await api.get(
        `/superadmin/companies/${companyId}`,
        { withCredentials: true }
      );


      setCompany(res.data.data);
    } catch (error: any) {
      toast.error("Failed to load company");
      router.back();
    }
  };

  /* ================= AUTH ================= */
  useEffect(() => {
    dispatch(fetchMe());
     fetchCompanyByOne();
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/access-denied");
      return;
    }

    fetchCompanyByOne();

    const timer = setTimeout(() => setShowLoading(false), 300);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user]);

  /* ================= LOADING ================= */
  if (loading || showLoading) {
    return (
      <div className="min-h-screen flex bg-slate-100">
        <SuperAdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex items-center justify-center">
          <Loading text="Loading company..." />
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <SuperAdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-slate-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold">
            Company Details
          </h1>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white border-b px-8 py-5">
          <h1 className="text-2xl font-bold text-slate-900">
            {company?.companyName}
          </h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 space-y-4">
             <button
    onClick={() => router.back()}
    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
  >
    <ArrowLeft size={18} />
    Back 
  </button>

         <AdminCompanyDetails
  company={company}
  onStatusChange={fetchCompanyByOne}
/>

        </main>
      </div>
    </div>
  );
}
