"use client";

import { fetchCompanies } from "@/store/slice/company/companySlice";
import { AppDispatch, Rootstate } from "@/store/store";
import api from "@/utils/baseUrl";
import { Building, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Company {
  _id: string;
  companyName: string;
  Companylocation: string;

}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}


export default function CompanySwitcherModal({ isOpen, onClose }: Props) {
  // const [companies,setCompanies]=useState<Company[]>([])
  const { companies, loading } = useSelector(
    (state: Rootstate) => state.company
  );
  const router = useRouter();

const dispatch=useDispatch<AppDispatch>()
useEffect(() => {
    if (isOpen && companies.length === 0) {
      dispatch(fetchCompanies());
    }
  }, [isOpen, companies.length, dispatch]);

{loading && (
  <p className="text-center py-4 text-sm text-gray-500">
    Loading companies...
  </p>
)}
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Companies</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Company list */}
        <div className="max-h-80 overflow-y-auto">
          {companies.map((company) => (
            <button
              key={company._id}
              onClick={() => {
                router.push(`/user/companies/${company._id}/view`);
                onClose();
              }}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition text-left"
            >
              <Building/>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {company.companyName}
                </p>
                <p className="text-xs text-gray-500">
                  {company.Companylocation}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-4">
          <button
            onClick={() => {
              router.push("/user/companies");
              onClose();
            }}
            className="w-full text-sm font-medium text-sky-600 hover:underline"
          >
            View all companies
          </button>
        </div>
      </div>
    </div>
  );
}
