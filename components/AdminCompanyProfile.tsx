"use client";

import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/baseUrl";

export interface AdminCompany {
  _id: string;
  companyName: string;
  Companylocation: string;
  email: string;
  phone: number;
  siteid: string;
  companyfield: string;
  approved: boolean;
  userId: {
    _id:string,
    isblocked:boolean
  };
}

interface Props {
  company: AdminCompany;
  onStatusChange?: () => void;
}

export default function AdminCompanyDetails({
  company,
  onStatusChange,
}: Props) {
  const toggleStatus = async () => {
    try {
        // console.log(!company.approved);
        
      const res = await api.patch(
        `/superadmin/company/${company._id}/status`,
        { status: !company.userId.isblocked },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      onStatusChange?.();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ================= HEADER CARD ================= */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Section */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-sky-100 flex items-center justify-center">
            <Building2 className="text-sky-600 w-10 h-10" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {company.companyName}
            </h1>

            <div className="flex items-center gap-3 mt-2">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                  company.userId.isblocked
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <ShieldCheck size={14} />
                {company.userId.isblocked ? "Disabled" : "Active"}
              </span>

              <span className="text-sm text-slate-500">
                Company ID: {company._id}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
       <button
  onClick={toggleStatus}
  className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 transform hover:scale-105 ${
    company.userId.isblocked
      ? "bg-green-600 hover:bg-green-700 text-white" 
      : "bg-red-600 hover:bg-red-700 text-white"
  }`}
>
  {company.userId.isblocked ? "Enable Company" : "Disable Company"}
</button>
      </div>

      {/* ================= DETAILS GRID ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Contact Information
          </h3>

          <div className="flex items-center gap-3 text-slate-700">
            <MapPin size={18} className="text-slate-500" />
            {company.Companylocation}
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <Mail size={18} className="text-slate-500" />
            {company.email}
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <Phone size={18} className="text-slate-500" />
            {company.phone}
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <Globe size={18} className="text-slate-500" />
            <a
              href={company.siteid}
              target="_blank"
              className="text-sky-600 hover:underline"
            >
              {company.siteid}
            </a>
          </div>
        </div>

        {/* Business Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Business Details
          </h3>

          <div className="flex items-center gap-3 text-slate-700">
            <Briefcase size={18} className="text-slate-500" />
            {company.companyfield}
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            <Building2 size={18} className="text-slate-500" />
            Linked User ID: {company.userId._id}
          </div>
        </div>
      </div>
    </div>
  );
}
