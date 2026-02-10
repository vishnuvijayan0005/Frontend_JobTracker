"use client";

import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  Eye,
  Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";
interface Company {
  _id: string;
  companyName: string;
  companyfield: string;
  Companylocation: string;
  email: string;
  phone: number;
  siteid?: string;
  approved: boolean;
  userId?: {
    isblocked: boolean;
  };
}
interface Props {
  company: Company;
  onView: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onEnable?: (id: string) => void;
  onDisable?: (id: string) => void;
}

export default function AdminCompanyCard({
  company,
  onView,
  onApprove,
  onReject,
  onEnable,
  onDisable,
}: Props) {

    
  return (
    <div className="bg-white border rounded-2xl p-5 sm:p-6 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="p-3 rounded-xl bg-slate-100 shrink-0">
            <Building2 className="h-6 w-6 text-slate-600" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {company.companyName}
            </h3>
            <p className="text-sm text-slate-500 truncate">
              {company.companyfield}
            </p>

            <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{company.Companylocation}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        {company.approved ? (
          <span className="flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
            <CheckCircle className="h-4 w-4" />
            Approved
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
            <XCircle className="h-4 w-4" />
            Pending
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-slate-100" />

      {/* Contact Info */}
      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex items-start gap-2 min-w-0">
          <Mail className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="break-all">{company.email}</span>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{company.phone}</span>
        </div>

        {company.siteid && (
          <div className="flex items-start gap-2 min-w-0">
            <Globe className="h-4 w-4 mt-0.5 shrink-0" />
            <a
              href={company.siteid}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all underline hover:text-sky-600"
            >
              {company.siteid}
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onView(company._id)}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>

        {/* 🔹 Pending → Approve / Reject */}
        {!company.approved && (
          <>
            {onApprove && (
              <Button
                size="sm"
                onClick={() => onApprove(company._id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
            )}

            {onReject && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(company._id)}
              >
                Reject
              </Button>
            )}
          </>
        )}

        {/* 🔹 Approved → Enable / Disable */}
        {company.approved && (
          <>
            {company.userId?.isblocked && onEnable && (
              <Button
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => onEnable(company._id)}
              >
                <Power className="h-4 w-4" />
                Enable
              </Button>
            )}

            {!company.userId?.isblocked && onDisable && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => onDisable(company._id)}
              >
                <Power className="h-4 w-4" />
                Disable
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
