"use client";

import React, { useState, useEffect } from "react";
import CompanySidebar from "@/components/CompanySidebar";
import Loading from "@/components/Loading";
import {
  Edit,
  Mail,
  Phone,
  Globe,
  Menu,
  Building2,
  Save,
  X,
} from "lucide-react";
import { fetchMe } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import api from "@/utils/baseUrl";
import toast from "react-hot-toast";
import * as v from "valibot";
import { companySchema } from "@/lib/validators/companyprofile";


/* ================= TYPES ================= */

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

type Errors = Partial<Record<keyof Companydetails, string>>;

/* ================= COMPONENT ================= */

export default function CompanyProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [company, setCompany] = useState<Companydetails | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth,
  );

  /* ================= AUTH ================= */

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== "companyadmin") {
        router.replace("/access-denied");
      } else {
        setTimeout(() => setShowLoading(false), 600);
      }
    }
  }, [loading, isAuthenticated, user, router]);

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get(`/companyadmin/profile`);
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
          logo: data.logo ?? "",
        });
      } catch {
        toast.error("Failed to load company profile");
      } finally {
        setShowLoading(false);
      }
    };

    fetchCompany();
  }, [user]);

  /* ================= SAVE ================= */

const handleSave = async () => {
  if (!company) return;

  const result = v.safeParse(companySchema, company);

  if (!result.success) {
    const fieldErrors: Errors = {};

    result.issues.forEach((issue) => {
      const key = issue.path?.[0]?.key;

      if (typeof key === "string" && key in company) {
        fieldErrors[key as keyof Companydetails] = issue.message;
      }
    });

    setErrors(fieldErrors);
    toast.error("Please fix the errors");
    return;
  }

  try {
    setIsSaving(true);
    const res = await api.put(
      "/companyadmin/editprofile",
      { company },
      { withCredentials: true },
    );

    toast.success(res.data.message);
    setErrors({});
    setIsEditing(false);
  } catch {
    toast.error("Failed to save changes");
  } finally {
    setIsSaving(false);
  }
};


  const mainMargin = sidebarCollapsed ? "md:ml-20" : "md:ml-64";

  if (loading || showLoading || !company) {
    return (
      <div className="w-screen h-screen flex">
        <CompanySidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <div className="flex-1 flex items-center justify-center">
          <Loading text="Loading..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-screen h-screen bg-slate-50 overflow-hidden">
      <CompanySidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${mainMargin}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 border rounded-md"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-xl font-semibold">Company Profile</h1>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Edit size={16} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setErrors({});
                  setIsEditing(false);
                }}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="bg-white rounded-2xl shadow-sm border p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="h-32 w-32 rounded-xl bg-blue-50 flex items-center justify-center">
                <Building2 size={64} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">{company.companyName}</h2>
              <p className="text-sm text-gray-500">{company.Companytype}</p>
            </div>

            {/* Right */}
            <div className="md:col-span-2 space-y-6">
              <Section title="Company Information">
                <Field
                  label="Company Name"
                  value={company.companyName}
                  error={errors.companyName}
                  editing={isEditing}
                  onChange={(v) =>
                    setCompany({ ...company, companyName: v })
                  }
                />
                <Field
                  label="Location"
                  value={company.Companylocation}
                  error={errors.Companylocation}
                  editing={isEditing}
                  onChange={(v) =>
                    setCompany({ ...company, Companylocation: v })
                  }
                />
                <Field
                  label="Industry"
                  value={company.Companytype}
                  error={errors.Companytype}
                  editing={isEditing}
                  onChange={(v) =>
                    setCompany({ ...company, Companytype: v })
                  }
                />
              </Section>

              <Section title="Contact Details">
                <Field
                  label="Email"
                  value={company.email}
                  error={errors.email}
                  editing={isEditing}
                  onChange={(v) =>
                    setCompany({ ...company, email: v })
                  }
                />
                <Field
                  label="Phone"
                  value={company.phone.toString()}
                  error={errors.phone}
                  editing={isEditing}
                  onChange={(v) =>
                    setCompany({ ...company, phone: Number(v) })
                  }
                />
                <Field
                  label="Website"
                  value={company.siteId}
                  error={errors.siteId}
                  editing={isEditing}
                  onChange={(v) =>
                    setCompany({ ...company, siteId: v })
                  }
                />
              </Section>

              <Section title="About">
                {isEditing ? (
                  <div>
                    <textarea
                      className={`w-full border rounded-lg p-3 ${
                        errors.description ? "border-red-500" : ""
                      }`}
                      rows={4}
                      value={company.description}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          description: e.target.value,
                        })
                      }
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">
                    {company.description}
                  </p>
                )}
              </Section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
  error,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      {editing ? (
        <>
          <input
            className={`border rounded-lg px-3 py-2 ${
              error ? "border-red-500" : ""
            }`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </>
      ) : (
        <span className="text-gray-800">{value}</span>
      )}
    </div>
  );
}
