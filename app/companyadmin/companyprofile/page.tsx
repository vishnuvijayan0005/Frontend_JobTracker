"use client";

import React, { useState, useEffect } from "react";
import CompanySidebar from "@/components/CompanySidebar";
import Loading from "@/components/Loading";
import { Edit, Mail, Phone, Globe, Menu } from "lucide-react";
import { fetchMe } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import api from "@/utils/baseUrl";

export interface Companydetails {
  _id?: string;
  companyName: string;
  Companylocation: string;
  phone: number;
  siteId: string;
  email: string;
  description: string;
  logo: string;
  Companytype: string;
}

export default function CompanyProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [company, setCompany] = useState<Companydetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  // Get auth state from Redux
  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth,
  );
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== "companyadmin") {
        router.replace("/access-denied");
      } else {
        // Ensure loader shows at least 1.5s
        const timer = setTimeout(() => {
          setShowLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [loading, isAuthenticated, user, router]);
  // console.log(user);
  
  useEffect(() => {
    if (!user?.id) return;

    const fetchCompany = async () => {
      try {
        const res = await api.get(`/companyadmin/profile/${user.id}`);
        const data = res.data.data; 

        setCompany({
          _id: data._id,
          companyName: data.companyName,
          Companylocation: data.Companylocation,
          phone: data.phone,
          email: data.email,
          siteId: data.siteid,              
          Companytype: data.companyfield,   
          description: data.description ?? "",
          logo: data.logo ?? "/default-logo.png",
        });
          setShowLoading(false);
        
      } catch (error) {
        console.error("Failed to fetch company profile", error);
      }
    };

    fetchCompany();
  }, [user]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (!company) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsEditing(false);
      setIsSaving(false);
    }, 1500);
  };

if (loading || showLoading || !company) return <Loading text="Loading company..." />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <CompanySidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto p-6">
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h1 className="text-2xl font-bold">My Company Profile</h1>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm"
              >
                <Edit className="h-4 w-4" /> Edit
              </button>
            )}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Company Profile</h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              <Edit className="h-4 w-4" /> Edit Profile
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={company.logo}
              alt="Company Logo"
              className="h-32 w-32 rounded-xl object-cover border"
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col gap-4">
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <input
                  className="border p-2 rounded-lg"
                  value={company.companyName}
                  onChange={(e) =>
                    setCompany({ ...company, companyName: e.target.value })
                  }
                />
                <input
                  className="border p-2 rounded-lg"
                  value={company.Companylocation}
                  onChange={(e) =>
                    setCompany({ ...company, Companylocation: e.target.value })
                  }
                />
                <input
                  className="border p-2 rounded-lg"
                  value={company.Companytype}
                  onChange={(e) =>
                    setCompany({ ...company, Companytype: e.target.value })
                  }
                />
                <input
                  className="border p-2 rounded-lg"
                  value={company.email}
                  onChange={(e) =>
                    setCompany({ ...company, email: e.target.value })
                  }
                />
                <input
                  className="border p-2 rounded-lg"
                  type="tel"
                  value={company.phone.toString()}
                  onChange={(e) =>
                    setCompany({ ...company, phone: Number(e.target.value) })
                  }
                />
                <input
                  className="border p-2 rounded-lg"
                  value={company.siteId}
                  onChange={(e) =>
                    setCompany({ ...company, siteId: e.target.value })
                  }
                />
                <textarea
                  className="border p-2 rounded-lg"
                  rows={4}
                  value={company.description}
                  onChange={(e) =>
                    setCompany({ ...company, description: e.target.value })
                  }
                />
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loading text="Saving..." size={18} />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">{company.companyName}</h2>
                <p className="text-gray-500">{company.Companylocation}</p>
                <p className="text-gray-500 italic"> {company.Companytype}</p>

                {/* Contact Info Grid - responsive */}
                <div className="grid grid-cols-1 gap-2 mt-2 sm:grid-cols-2 sm:gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />{" "}
                    <span className="break-all">{company.email}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />{" "}
                    <span className="break-all">{company.phone}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-gray-600 sm:col-span-1">
                    <Globe className="h-4 w-4" />{" "}
                    <span className="break-all">{company.siteId}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-1">About the Company</h3>
                  <p className="text-gray-700 text-sm">{company.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {/* <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white shadow-lg rounded-2xl p-4 text-center">
            <h4 className="text-gray-500 text-sm">Open Jobs</h4>
            <p className="text-xl font-bold mt-1">12</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-4 text-center">
            <h4 className="text-gray-500 text-sm">Applicants</h4>
            <p className="text-xl font-bold mt-1">234</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-4 text-center">
            <h4 className="text-gray-500 text-sm">Company Rating</h4>
            <p className="text-xl font-bold mt-1">4.8 ⭐</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
