"use client";

import { useState } from "react";
import { Building2, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";


import Loading from "./Loading";
import { AppDispatch } from "@/store/store";
import { logoutUser } from "@/store/slice/auth/auth";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    await dispatch(logoutUser());
    router.replace("/");
  };

  if (loggingOut) return <Loading text="Logging out..." />;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Building2 className="h-6 w-6" /> Admin Panel
        </div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r z-50
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:flex flex-col
        `}
      >
        <div className="p-6 text-xl font-bold flex items-center gap-2 md:hidden">
          <Building2 className="h-6 w-6" />
          Admin Panel
        </div>

        <nav className="flex-1 px-4 space-y-2 text-sm mt-6 md:mt-0">
          <NavItem label="Dashboard" />
          <NavItem label="Companies" />
          <NavItem label="Jobs" />
          <NavItem label="Applicants" />
          <NavItem label="Settings" />
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-500"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function NavItem({ label }: { label: string }) {
  return (
    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 font-medium">
      {label}
    </button>
  );
}
