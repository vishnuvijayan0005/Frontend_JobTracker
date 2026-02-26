"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "lucide-react";

import SuperAdminSidebar from "@/components/AdminSidebar";
import AdminCompanyCard from "@/components/AdminCompanyCard";
import Loading from "@/components/Loading";

import { fetchMe } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";
import { Company, fetchCompanies } from "@/store/slice/company/companySlice";
import api from "@/utils/baseUrl";
interface Companydata {
  _id: string;
  companyName: string;
  Companylocation: string;
  companyfield: string;
  email: string;
  phone: number;
  siteid: string;
  approved: boolean;
}
export default function AdminCompaniesPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  /* ================= STATE ================= */

  const [showLoading, setShowLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [companiesapproval,setComapaniesapprovals]=useState<Companydata[]>([])

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );

  /* ================= AUTH ================= */
const fectcompaniesapproavals=async()=>{
    try {
        const res= await api.get("/superadmin/companies")
        setComapaniesapprovals(res.data.data)
  
    
        
    } catch (error) {
        console.error(error,"----from approval page---")
    }
}
useEffect(()=>{
    fectcompaniesapproavals()
},[])
  useEffect(() => {
    dispatch(fetchMe());
   
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/access-denied");
      return;
    }

    const timer = setTimeout(() => setShowLoading(false), 400);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user, router]);


if (loading || showLoading) {
  return (
    <div className="min-h-screen flex">
      <SuperAdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex items-center justify-center">
        <Loading text="Loading ..." />
      </div>
    </div>
  );
}

  /* ================= ACTIONS ================= */

  const approveCompany = async(id: string) => {
   await api.patch(`/superadmin/companyupdate/${id}/status`,{status:true},{withCredentials:true})
   fectcompaniesapproavals()
  };

  const rejectCompany =async (id: string) => {
    await api.patch(`/superadmin/companyupdate/${id}/status`,{status:false},{withCredentials:true})
   fectcompaniesapproavals()
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <SuperAdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-slate-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">
            Companies
          </h1>
        </header>

        {/* Desktop / Main */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Page Header */}
          <div className="hidden lg:block">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Companies Management
            </h1>
            <p className="text-slate-500 mt-1">
              Review, approve or reject registered companies
            </p>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {companiesapproval?.length > 0 ? (
              companiesapproval.map((company) => (
                <AdminCompanyCard
  key={company._id}
  company={company}
  onView={(id:any) =>
    router.push(`/superadmin/companies/${id}`)
  }
  onApprove={approveCompany}
  onReject={rejectCompany}
 
/>

              ))
            ) : (
              <div className="col-span-full text-center text-slate-500 py-16">
                No companies found
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
