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
    id?:string;
    title: string;
    companyName: string;
    location: string;
    jobType: string;
    createdAt: string;
    status: string;
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
    console.log(job);
    
//   const statusStyles = {
//     active: "bg-green-100 text-green-700",
//     pending: "bg-yellow-100 text-yellow-700",
//     rejected: "bg-red-100 text-red-700",
//   };

  return (
    <Card className="border border-slate-200 hover:shadow-md transition">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <Building2 className="h-4 w-4" />
              {job.companyName}
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${[job.status]}`}
          >
            {job.status.toUpperCase()}
          </span>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {job.location}
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {job.jobType}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Posted {job.createdAt}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onView}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm
                       rounded-md border border-slate-200
                       hover:bg-slate-100 text-slate-700"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          {job.status === "pending" && (
            <>
              <button
                onClick={onApprove}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm
                           rounded-md bg-green-600 text-white
                           hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </button>

              <button
                onClick={onReject}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm
                           rounded-md bg-red-600 text-white
                           hover:bg-red-700"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
