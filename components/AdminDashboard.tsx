"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Briefcase,
  Users,
  ShieldCheck,
} from "lucide-react";
import SuperAdminSidebar from "./AdminSidebar";

import api from "@/utils/baseUrl";
import SuperAdminNavbar from "./AdminNavbar";

interface DashboardStats {
  totalCompanies: number;
  activeJobs: number;
  totalUsers: number;
  pendingApprovals: number;
}

export default function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard info from backend
  useEffect(() => {
    const fetchDashboardInfo = async () => {
      try {
        const res = await api.get("/superadmin/dashboard"); // your API endpoint
        if (res.data.success) {
          setStats(res.data.data.stats);
          setActivity(res.data.data.activity);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardInfo();
  }, []);

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
            {loading ? (
              <p>Loading stats...</p>
            ) : (
              <>
                <Stat
                  title="Registered Companies"
                  value={stats?.totalCompanies.toLocaleString() || "0"}
                  icon={Building2}
                />
                <Stat
                  title="Active Job Posts"
                  value={stats?.activeJobs.toLocaleString() || "0"}
                  icon={Briefcase}
                />
                <Stat
                  title="Total Users"
                  value={stats?.totalUsers.toLocaleString() || "0"}
                  icon={Users}
                />
                <Stat
                  title="Pending Approvals"
                  value={stats?.pendingApprovals.toLocaleString() || "0"}
                  icon={ShieldCheck}
                  highlight
                />
              </>
            )}
          </div>

          {/* Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
  <Card className="xl:col-span-3">
    <CardContent className="p-6">
      <h2 className="font-semibold text-lg mb-4">
        Recent Platform Activity
      </h2>

      {loading ? (
        <p>Loading activity...</p>
      ) : activity.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent activity</p>
      ) : (
        <ul className="space-y-3 text-sm text-slate-600">
          {activity.map((act, idx) => (
            <li key={idx}>{act}</li>
          ))}
        </ul>
      )}
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
  value: string | number;
  icon: any;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-red-300 bg-red-50" : ""}>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
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
