"use client";

import {
  Briefcase,
  Users,
  LayoutDashboard,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/store/store";
import { logoutUser } from "@/store/slice/auth/auth";
import { useState } from "react";
import Loading from "./Loading";
import Link from "next/link";



interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function CompanySidebar({ isOpen, setIsOpen }: SidebarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
   const [isLoggingOut, setIsLoggingOut] = useState(false);


  const handleLogout = async () => {
   setIsLoggingOut(true);     
   
  await setTimeout(async() => {
     await dispatch(logoutUser());
      router.replace("/");            
    }, 1500);
  };
if(isLoggingOut){
  return <Loading text="logging out the user"/>
}
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r z-50
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:flex flex-col
        `}
      >
        {/* Mobile Header */}
        <div className="p-6 text-2xl font-bold flex items-center gap-4 md:hidden">
          <Building2 className="h-6 w-6" /> Company Panel
        </div>

        {/* Navigation */}


<nav className="flex-1 px-6 space-y-4 text-sm mt-6 md:mt-0">
  <Link
    href="/companyadmin"
    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-slate-100 font-medium text-gray-700"
  >
    <LayoutDashboard />
    Dashboard
  </Link>

  <Link
    href="/companyadmin/myjob"
    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-slate-100 font-medium text-gray-700"
  >
    <Briefcase />
    My Jobs
  </Link>

  <Link
    href="/companyadmin/applicants"
    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-slate-100 font-medium text-gray-700"
  >
    <Users />
    Applicants
  </Link>

  <Link
    href="/companyadmin/companyprofile"
    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-slate-100 font-medium text-gray-700"
  >
    <Settings />
    Company Profile
  </Link>
</nav>


        {/* Logout */}
        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 text-sm font-medium hover:bg-red-50 w-full px-3 py-2 rounded-lg"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({ icon, label }: any) {
  return (
    <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-slate-100 font-medium text-gray-700">
      {icon}
      {label}
    </button>
  );
}
