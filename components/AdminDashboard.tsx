"use client";

import { Card, CardContent } from "@/components/ui/card";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";



export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold">Company Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Companies" value="24" />
            <StatCard title="Active Jobs" value="128" />
            <StatCard title="Applicants" value="1,204" />
            <StatCard title="Pending Reviews" value="37" />
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Recent Job Postings</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>Frontend Developer – Google</p>
                <p>Backend Engineer – Amazon</p>
                <p>UI/UX Designer – Microsoft</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
