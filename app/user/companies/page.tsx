"use client";

import React, { useEffect, useState } from "react";
import UserNavbar from "@/components/UserNavbar";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, Rootstate } from "@/store/store";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import { fetchMe } from "@/store/slice/auth/auth";
import { Building2, MapPin, Search } from "lucide-react";
import { fetchCompanies, fetchCompanyFields } from "@/store/slice/company/companySlice";

const CompanyList = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );
  const { companies, fields } = useSelector(
  (state: Rootstate) => state.company
);



  const [showLoading, setShowLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedField, setSelectedField] = useState("");

  /* ================= AUTH ================= */
  useEffect(() => {
    dispatch(fetchMe());
      dispatch(fetchCompanyFields());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "user") {
      router.replace("/access-denied");
      return;
    }

    const t = setTimeout(() => setShowLoading(false), 300);
    return () => clearTimeout(t);
  }, [loading, isAuthenticated, user, router]);


  useEffect(() => {
    if (!isAuthenticated) return;

    const timer = setTimeout(() => {
      dispatch(
        fetchCompanies({
          search: query,
          field: selectedField,
        })
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [dispatch, query, selectedField, isAuthenticated]);

  if (loading || showLoading) {
    return <Loading text="Loading companies..." />;
  }

  if (!isAuthenticated || !user) return null;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserNavbar />

      {/* ===== HEADER ===== */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Discover Companies
          </h1>
          <p className="mt-3 text-gray-500">
            Browse companies that are actively hiring and growing
          </p>

          {/* Search */}
          <div className="mt-8 relative mx-auto max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by company, field, or location"
              className="w-full rounded-2xl border px-12 py-3 text-sm
                         shadow-sm focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </section>

      {/* ===== FIELD FILTER ===== */}
   {fields.length > 0 && (
  <section className="border-b py-4 bg-gray-50">
    <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3 justify-center">
      {fields.map((field) => (
        <button
          key={field}
          onClick={() =>
            setSelectedField(selectedField === field ? "" : field)
          }
          className={`px-4 py-2 rounded-full text-sm font-medium
            ${
              selectedField === field
                ? "bg-sky-600 text-white"
                : "bg-white border hover:bg-sky-100"
            }`}
        >
          {field}
        </button>
      ))}
    </div>
  </section>
)}


      {/* ===== CONTENT ===== */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {companies.length === 0 ? (
            <div className="bg-white p-16 text-center rounded-3xl border">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-500">
                No companies found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {companies.map((company) => (
                <button
                  key={company._id}
                  onClick={() =>
                    router.push(
                      `/user/companies/${company._id}/view`
                    )
                  }
                  className="group bg-white border rounded-3xl p-7
                             hover:-translate-y-1 hover:shadow-xl transition"
                >
                  <div className="flex gap-4">
                    <div className="h-14 w-14 bg-sky-100 rounded-2xl flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-sky-600">
                        {company.companyName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {company.companyfield}
                      </p>
                    </div>
                  </div>

                  <div className="my-6 h-px bg-gray-100" />

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {company.Companylocation}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyList;
