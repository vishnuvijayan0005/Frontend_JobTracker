"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Briefcase,
  Users,
  ShieldCheck,
} from "lucide-react";
import SuperAdminSidebar from "./AdminSidebar";
import SuperAdminNavbar from "./AdminNavbar";

export default function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <SuperAdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <SuperAdminNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Super Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Platform overview & administrative control
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <Stat title="Registered Companies" value="124" icon={Building2} />
            <Stat title="Active Job Posts" value="2,318" icon={Briefcase} />
            <Stat title="Total Users" value="48,920" icon={Users} />
            <Stat
              title="Pending Approvals"
              value="19"
              icon={ShieldCheck}
              highlight
            />
          </div>

          {/* Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="xl:col-span-2">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">
                  Recent Platform Activity
                </h2>

                <ul className="space-y-3 text-sm text-slate-600">
                  <li>✔ New company registered: <b>Acme Corp</b></li>
                  <li>⚠ Company pending approval: <b>NextHire</b></li>
                  <li>📄 12 new jobs posted today</li>
                  <li>👤 328 new users joined</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">
                  System Status
                </h2>

                <div className="space-y-3 text-sm">
                  <Status label="API Status" ok />
                  <Status label="Database" ok />
                  <Status label="Auth Service" ok />
                  <Status label="Email Service" warn />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Stat({
  title,
  value,
  icon: Icon,
  highlight,
}: {
  title: string;
  value: string;
  icon: any;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-red-300 bg-red-50" : ""}>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {value}
          </p>
        </div>
        <div
          className={`p-3 rounded-xl ${
            highlight
              ? "bg-red-100 text-red-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}

function Status({ label, ok, warn }: any) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span
        className={`text-xs font-semibold px-2 py-1 rounded-full ${
          ok
            ? "bg-green-100 text-green-700"
            : warn
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {ok ? "Healthy" : warn ? "Warning" : "Down"}
      </span>
    </div>
  );
}
