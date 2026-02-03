"use client";

import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCheck,
  ClipboardCheck,
  Building2,
  LogOut,
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

export default function CompanySidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    setLoggingOut(true);
    await dispatch(logoutUser());
    router.replace("/");
  };

  if (loggingOut) return <Loading text="Logging out..." />;

  const navItems = [
    { label: "Dashboard", href: "/companyadmin", icon: LayoutDashboard },
    { label: "My Jobs", href: "/companyadmin/myjob", icon: Briefcase },
    { label: "Applicants", href: "/companyadmin/applicants", icon: Users },
    { label: "Shortlisted", href: "/companyadmin/shortlisted", icon: UserCheck },
    { label: "Update Result", href: "/companyadmin/updateresult", icon: ClipboardCheck },
    { label: "Company Profile", href: "/companyadmin/companyprofile", icon: Building2 },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Building2 className="h-5 w-5 text-blue-600" />
          Company Admin
        </div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white border-r
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static
          flex flex-col
        `}
      >
        {/* Brand Header */}
        <div className="hidden md:flex items-center gap-3 px-6 py-6
                        bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="p-2 bg-white/20 rounded-xl">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">Company Admin</p>
            <p className="text-xs text-white/80">Hiring Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/companyadmin" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    active
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                {/* Active Indicator */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2
                                   h-6 w-1 rounded-r-full bg-blue-600" />
                )}

                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                       text-red-600 hover:bg-red-50 font-semibold transition"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
