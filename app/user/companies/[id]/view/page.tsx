"use client";

import React, { useEffect, useState } from "react";
import UserNavbar from "@/components/UserNavbar";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, Rootstate } from "@/store/store";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import { fetchMe } from "@/store/slice/auth/auth";
import { Building2, MapPin, Mail, Phone, Globe } from "lucide-react";
import { Company, fetchCompanies } from "@/store/slice/company/companySlice";
import api from "@/utils/baseUrl";

const Companywise = () => {
  const router = useRouter();
  const params = useParams();
  const companyId = params?.id;

  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuthenticated, user } = useSelector((state: Rootstate) => state.auth);
  const { companies } = useSelector((state: Rootstate) => state.company);

  const [showLoading, setShowLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
const [company,setCompany]=useState<Company>()
  /* ================= AUTH ================= */
  const fetchOnecompany=async()=>{
try {
  const res=await api.get(`/user/company/${companyId}`,{withCredentials:true})
  setCompany(res.data.data.company)
 setSubscribed(res.data.data.isSubscribed)
  
} catch (error) {
  console.error(error)
}
  }
  useEffect(() => {
    dispatch(fetchMe());
   fetchOnecompany()
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




  /* ================= SUBSCRIBE ================= */
 const handleSubscribeToggle = async () => {
  if (!companyId) return;
  setSubscribing(true);

  try {
    if (subscribed) {
      // If already subscribed → call unsubscribe API
      await api.post(
        `/user/unsubscribe/${companyId}`,
        {},
        { withCredentials: true }
      );
      setSubscribed(false);
    } else {
      // If not subscribed → call subscribe API
      await api.post(
        `/user/subscribe/${companyId}`,
        {},
        { withCredentials: true }
      );
      setSubscribed(true);
    }
  } catch (err) {
    console.error("Subscription toggle failed:", err);
  } finally {
    setSubscribing(false);
  }
};


  if (loading || showLoading) return <Loading text="Loading company details..." />;
  if (!isAuthenticated || !user) return null;
  if (!company)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <UserNavbar />
        <div className="bg-white p-12 rounded-2xl text-center border shadow-sm">
          <p className="text-gray-500 text-lg">Company not found</p>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserNavbar />

      {/* ===== HERO / COMPANY HEADER ===== */}
      <section className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* Icon */}
          <div className="h-24 w-24 md:h-28 md:w-28 rounded-3xl bg-sky-100 flex items-center justify-center shrink-0">
            <Building2 className="h-10 w-10 md:h-12 md:w-12 text-sky-600" />
          </div>

          {/* Name & Basic Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {company.companyName}
                </h1>
                <p className="text-lg text-gray-600">{company.companyfield}</p>
                <div className="flex items-center gap-4 text-gray-600 text-sm md:text-base mt-2">
                  <MapPin className="h-5 w-5" />
                  <span>{company.Companylocation}</span>
                </div>
              </div>

              {/* Subscribe Button */}
            <button
  onClick={handleSubscribeToggle}
  disabled={subscribing}
  className={`px-6 py-3 rounded-full text-white font-medium text-sm md:text-base
              ${subscribed ? "bg-red-600 hover:bg-red-700" : "bg-sky-600 hover:bg-sky-700"} transition`}
>
  {subscribed ? "Subscribed" : "Subscribe"}
</button>

            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPANY DETAILS ===== */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Contact Info */}
        <section className="bg-white rounded-3xl shadow p-10 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-sky-500" />
              <span>{company.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-sky-500" />
              <span>{company.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-sky-500" />
              <a
                href={company.siteid}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-sky-600"
              >
                {company.siteid}
              </a>
            </div>
          </div>
        </section>

        {/* About Company */}
        <section className="bg-white rounded-3xl shadow p-10 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">About Company</h2>
          <p className="text-gray-700 text-sm md:text-base">
            {company.companyName} operates in the <strong>{company.companyfield}</strong> domain, located in <strong>{company.Companylocation}</strong>. You can reach them via email or phone for further details.
          </p>
        </section>

        {/* Back Button */}
        <div>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-full bg-sky-600 text-white text-sm md:text-base font-medium hover:bg-sky-700 transition"
          >
            Go Back
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Companywise;
