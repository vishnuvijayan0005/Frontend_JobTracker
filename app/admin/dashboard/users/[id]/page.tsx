"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import SuperAdminSidebar from "@/components/AdminSidebar";

import Loading from "@/components/Loading";


import { fetchMe } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";

import api from "@/utils/baseUrl";
import toast from "react-hot-toast";
import AdminUserProfileView, { AdminUserProfile } from "@/components/AdminUserProfile";





const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
const [users,setUsers]=useState<AdminUserProfile>()
  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );
  const params = useParams();

  const id = params?.id as string;


  const fetchusers = async (userId: string) => {
    try {
      const res = await api.get(
        `/superadmin/user/${userId}/view`,
        { withCredentials: true }
      );

      console.log(res.data.data);
      setUsers(res.data.data);
    } catch (error) {
      console.error("Fetch user error:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchMe());

    if (id) {
      fetchusers(id);
    }
  }, [dispatch, id]); 


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

 const unblockUser= async (id: string) => {

    const res = await api.patch(
      `/superadmin/user/${id}/status`,
      { status: false },
      { withCredentials: false },
    );
    fetchusers(id)
    toast.success(res.data.message);
  };

  const blockUser= async (id: string) => {
    
    const res = await api.patch(
      `/superadmin/user/${id}/status`,
      { status: true },
      { withCredentials: false },
    );
     fetchusers(id)
    toast.success(res.data.message);
  };
//   const deleteUser = (id: string) => {
//     console.log("Delete user:", id);
//   };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <SuperAdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-slate-100"
          >
            <Menu className="h-6 w-6 text-slate-700" />
          </button>
          <h1 className="text-lg font-semibold text-slate-900">
            User Management
          </h1>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 px-8 py-5 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              User Management
            </h1>
            <p className="text-sm text-slate-500">
              Manage platform users, roles, and access
            </p>
          </div>

       
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
  <button
    onClick={() => router.back()}
    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
  >
    <ArrowLeft size={18} />
    Back to Users
  </button>
</div>
  {users && (
  <AdminUserProfileView
    userData={users}
    onBlock={blockUser}
    onUnblock={unblockUser}
  />
  )}
</main>
      </div>
    </div>
  );
};

export default Page;
