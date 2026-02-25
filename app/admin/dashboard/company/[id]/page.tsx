"use client";

import React, { useEffect, useState, useCallback } from "react";
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

  const [isFetching, setIsFetching] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [company, setCompany] = useState<any>(null);

  const { loading: authLoading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );

  const fetchCompanyByOne = useCallback(async () => {
    if (!companyId) return;
    try {
      const res = await api.get(`/superadmin/companies/${companyId}`, {
        withCredentials: true,
      });
      setCompany(res.data.data);
    } catch (error: any) {
      toast.error("Failed to load company");
      router.back();
    } finally {
      setIsFetching(false);
    }
  }, [companyId, router]);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/access-denied");
      return;
    }

    fetchCompanyByOne();
  }, [authLoading, isAuthenticated, user, fetchCompanyByOne, router]);

  // Unified loading state check
  if (authLoading || isFetching) {
    return (
      <div className="min-h-screen flex bg-slate-100">
        <SuperAdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <Loading text="Loading company details..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <SuperAdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* CHANGED: Removed lg:ml-64 to fix extra space issue */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-slate-100"
          >
            <Menu className="h-6 w-6 text-slate-700" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900 truncate">
            Company Details
          </h1>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 px-8 py-5 items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-900 truncate">
            {company?.companyName || "Company Details"}
          </h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Companies
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <AdminCompanyDetails
              company={company}
              onStatusChange={fetchCompanyByOne}
            />
          </div>
        </main>
      </div>
    </div>
  );
}