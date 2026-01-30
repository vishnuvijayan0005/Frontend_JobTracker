"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import UserNavbar from "@/components/UserNavbar";
import Loading from "@/components/Loading";
import { AppDispatch, Rootstate } from "@/store/store";
import { fetchMe } from "@/store/slice/auth/auth";
import toast, { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth,
  );

  const [showLoading, setShowLoading] = useState(true);


  const toastShown = useRef(false);
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
      toastShown.current = true; // mark toast as shown

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
   <div className="min-h-screen flex flex-col bg-gray-50">
  {/* Navbar */}
  <UserNavbar />

  {/* Main Content (takes remaining height) */}
  <main className="flex-1 max-w-7xl mx-auto p-6 w-full">
    <h1 className="text-2xl font-bold">
      Welcome, {user.name || "User"}!
    </h1>
    {/* More content here */}
  </main>

  {/* Footer (always at bottom) */}
  <Footer />
</div>

  );
}
