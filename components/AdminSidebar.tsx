"use client";

import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  ShieldCheck,
  FileText,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logoutUser } from "@/store/slice/auth/auth";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Companies", href: "/admin/dashboard/company", icon: Building2 },
  { label: "Jobs", href: "/admin/dashboard/jobs", icon: Briefcase },
  { label: "Users", href: "/admin/dashboard/users", icon: Users },
  { label: "Approvals", href: "/admin/dashboard/approvals", icon: ShieldCheck },
  { label: "Audit Logs", href: "/admin/dashboard/auditlog", icon: FileText },
];

export default function SuperAdminSidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const logout = async () => {
    await dispatch(logoutUser());
    router.replace("/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-slate-900 text-slate-200 flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="px-6 py-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Platform Control</h2>
            <p className="text-xs text-slate-400">Super Administrator</p>
          </div>

          <button onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${
                    active
                      ? "bg-slate-800 text-white"
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg
                     text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
