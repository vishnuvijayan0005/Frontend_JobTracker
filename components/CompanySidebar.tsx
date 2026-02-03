"use client";

import {
  Briefcase,
  Users,
  LayoutDashboard,
  Building2,
  LogOut,
  UserCheck2,
  ClipboardCheck,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { AppDispatch } from "@/store/store";
import { logoutUser } from "@/store/slice/auth/auth";
import Loading from "./Loading";

interface SidebarProps {
  isOpen: boolean; 
  setIsOpen: (open: boolean) => void;
  collapsed?: boolean;
  setCollapsed?: (state: boolean) => void;
}

export default function CompanySidebar({
  isOpen,
  setIsOpen,
  collapsed = false,
  setCollapsed = () => {},
}: SidebarProps) {
  const router=useRouter()
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    setLoggingOut(true);
    setTimeout(async () => {
      await dispatch(logoutUser());
      setLoggingOut(false);
      router.replace("/");
    }, 1000);
  };

  if (loggingOut) return <Loading text="Logging out..." />;

  const navItems = [
    { label: "Dashboard", href: "/companyadmin", icon: LayoutDashboard },
    { label: "My Jobs", href: "/companyadmin/myjob", icon: Briefcase },
    { label: "Applicants", href: "/companyadmin/applicants", icon: Users },
    { label: "Shortlisted", href: "/companyadmin/shortlisted", icon: UserCheck2 },
    { label: "Update Result", href: "/companyadmin/updateresult", icon: ClipboardCheck },
    { label: "Company Profile", href: "/companyadmin/companyprofile", icon: Building2 },
  ];

  return (
    <>
 
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

 
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          w-64 md:w-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex flex-col
        `}
      >
        
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
            <div className="p-2 bg-white/20 rounded-lg">
              <Building2 className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div>
                <p className="font-bold text-lg">Company Admin</p>
                <p className="text-sm text-white/80">Dashboard</p>
              </div>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>

          <div className="hidden md:flex">
            {!collapsed ? (
              <button
                className="text-white/80 hover:text-white"
                onClick={() => setCollapsed(true)}
                title="Collapse"
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              <button
                className="text-white/80 hover:text-white"
                onClick={() => setCollapsed(false)}
                title="Expand"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 px-2 py-6 space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/companyadmin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  relative flex items-center gap-4 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${active ? "bg-blue-50 text-blue-700 font-semibold shadow-md" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                  ${collapsed ? "justify-center px-0" : ""}
                `}
                title={collapsed ? item.label : undefined}
                onClick={() => setIsOpen(false)} // close sidebar on mobile click
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && item.label}
                {active && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>

  
        <div className="px-4 py-5 border-t">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-4 py-3 rounded-lg
              text-red-600 hover:bg-red-50 font-semibold transition
              ${collapsed ? "justify-center px-0" : ""}
            `}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
