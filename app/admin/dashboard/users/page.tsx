"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import SuperAdminSidebar from "@/components/AdminSidebar";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";

import { fetchMe } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";
import AdminUserCard, { AdminUser } from "@/components/AdminUserXCard";
import api from "@/utils/baseUrl";
import toast from "react-hot-toast";




const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
const [users,setUsers]=useState<AdminUser[]>([])
  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );


const fetchusers= async()=>{
    try {
        const res=await api.get("/superadmin/users",
            {withCredentials:true}
        )
   
        
        setUsers(res.data.data)
       
        
    } catch (error) {
        
    }
}
 
  useEffect(() => {
    dispatch(fetchMe());
    fetchusers()
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

 const unblockUser= async (id: string) => {

    const res = await api.patch(
      `/superadmin//user/${id}/status`,
      { status: false },
      { withCredentials: false },
    );
    fetchusers()
    toast.success(res.data.message);
  };

  const blockUser= async (id: string) => {
    
    const res = await api.patch(
      `/superadmin//user/${id}/status`,
      { status: true },
      { withCredentials: false },
    );
     fetchusers()
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {users.map((u) => (
              <AdminUserCard
                key={u._id}
                users={u}
                onView={(id) =>
                  router.push(`/admin/dashboard/users/${id}`)
                }
                onBlock={blockUser}
                onUnblock={unblockUser}
                // onDelete={deleteUser}
              />
            ))}
          </div>

          {/* Empty State */}
          {users.length === 0 && (
            <div className="text-center text-slate-500 py-20">
              No users found
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;
