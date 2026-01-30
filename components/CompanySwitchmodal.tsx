"use client";

import api from "@/utils/baseUrl";
import { Building, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Company {
  _id: string;
  companyName: string;
  Companylocation: string;

}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// const demoCompanies: Company[] = [
//   {
//     _id: "1",
//     name: "TechNova",
//     location: "Bangalore",
 
//   },
//   {
//     _id: "2",
//     name: "Cloudify",
//     location: "Remote",
    
//   },
//   {
//     _id: "3",
//     name: "DesignHub",
//     location: "Mumbai",
  
//   },
// ];

export default function CompanySwitcherModal({ isOpen, onClose }: Props) {
  const [companies,setCompanies]=useState<Company[]>([])

  const router = useRouter();
const hasFetched = useRef(false);

useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;

  const fetchcompanies = async () => {
    const res = await api.get("/user/companieslist", {
      withCredentials: true,
    });
    console.log(res.data.data);
    
    setCompanies(res.data.data);
  };

  fetchcompanies();
}, []);
// console.log(companies,"------><>");

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
                // router.push(`/company/${company._id}`);
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
              router.push("/companies");
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
