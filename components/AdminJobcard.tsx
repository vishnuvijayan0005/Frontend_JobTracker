"use client";

import {
  Building2,
  MapPin,
  Briefcase,
  CalendarDays,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AdminJobCardProps {
  job: {
    id?: string;
    title: string;
    companyName: string;
    location: string;
    jobType: string;
    createdAt: string;
    status: string;
    forcedclose: boolean;
  };
  onView?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function AdminJobCard({
  job,
  onView,
  onApprove,
  onReject,
}: AdminJobCardProps) {
  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    approved: "bg-green-100 text-green-700 border border-green-200",
    rejected: "bg-red-100 text-red-700 border border-red-200",
    active: "bg-green-100 text-green-700 border border-green-200",
  };

  return (
    <Card className="group border border-slate-200 rounded-2xl hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-slate-900 group-hover:text-indigo-600 transition">
              {job.title}
            </h3>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Building2 className="h-4 w-4 text-slate-400" />
              {job.companyName}
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              statusStyles[job.status] ||
              "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
          >
            {job.status}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            {job.location}
          </div>

          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-slate-400" />
            {job.jobType}
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            Posted{" "}
            {new Date(job.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-3">
          <button
            onClick={onView}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium
                       rounded-xl border border-slate-200
                       hover:bg-slate-100 transition"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          {job.forcedclose ? (
            <button
              onClick={onApprove}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium
               rounded-xl bg-green-600 text-white
               hover:bg-green-700 transition shadow-sm"
            >
              <CheckCircle className="h-4 w-4" />
              Admin Open
            </button>
          ) : (
            <button
              onClick={onReject}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium
               rounded-xl bg-red-600 text-white
               hover:bg-red-700 transition shadow-sm"
            >
              <XCircle className="h-4 w-4" />
              Admin Close
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
