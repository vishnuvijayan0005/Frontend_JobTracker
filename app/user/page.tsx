"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import UserNavbar from "@/components/UserNavbar";
import Loading from "@/components/Loading";
import { AppDispatch, Rootstate } from "@/store/store";
import { fetchMe } from "@/store/slice/auth/auth";
import toast from "react-hot-toast";
import Footer from "@/components/Footer";
import JobSearch from "@/components/SearchComponent";
import ATSResult from "@/components/ATSResult";
import ResumeATSForm from "@/components/ResumeATSForm";
import img from "@/public/homebanner1.jpg";
import Image from "next/image";
import SmallAutoBanner from "@/components/Autobanner";
export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [openAd, setOpenAd] = useState<boolean>(true);

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth,
  );

  const [showLoading, setShowLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const toastShown = useRef(false);

  // Block scrolling while ad is open
  useEffect(() => {
    if (openAd) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openAd]);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "user") {
      router.replace("/access-denied");
      return;
    }

    if (user?.isprofilefinished === false && !toastShown.current) {
      toastShown.current = true;

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex border`}
        >
          <div className="w-2 bg-red-600 rounded-l-2xl" />
          <div className="flex-1 p-4">
            <p className="text-sm font-semibold text-gray-800">
              Profile Incomplete
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Please complete your profile before continuing.
            </p>
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  router.push("/user/profile");
                }}
                className="text-sm font-medium text-sky-600 hover:underline"
              >
                Complete now
              </button>
            </div>
          </div>
        </div>
      ));
    }

    const timer = setTimeout(() => setShowLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user]);

  if (loading || showLoading) return <Loading text="Fetching your data..." />;

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full relative">
      {/* Modal-style Fullscreen Banner Ad */}
      {openAd && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/40 backdrop-blur-sm">
          {/* Banner */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-xl w-full mt-10 overflow-hidden flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-1/3 w-full h-32 md:h-auto relative">
              <Image
                src={img}
                alt="ATS Checker"
                className="object-cover w-full h-full"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Improve Your ATS Score!
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Upload your resume and see how well it performs against ATS
                  systems.
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => {
                    const element = document.getElementById("ats-form");
                    element?.scrollIntoView({ behavior: "smooth" });
                    setOpenAd(false);
                  }}
                  className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition"
                >
                  Try Now
                </button>

                <button
                  onClick={() => setOpenAd(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <UserNavbar />

      {/* Main Content */}
      <main className="flex-1 w-full md:px-8 lg:py-12">
        {/* Job Search */}
        <div className="w-full bg-gradient-to-b from-sky-50 to-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <JobSearch />
          </div>
        </div>

        {/* Resume ATS Form */}
        <div id="ats-form" className="max-w-3xl mx-auto w-full mt-12">
          <ResumeATSForm onResult={setResult} />
        </div>

        {/* ATS Result */}
        {result && (
          <div className="max-w-4xl mx-auto w-full mt-12">
            <ATSResult
              score={result.score}
              breakdown={result.breakdown}
              missingKeywords={result.missingKeywords}
              improvements={result.improvements}
            />
          </div>
        )}
      </main>

       <SmallAutoBanner
              images={[
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&h=300&q=80",
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&h=300&q=80",
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&h=300&q=80",
              ]}
            />
      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
