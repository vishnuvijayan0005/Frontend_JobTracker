"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import CompanyDashboard from "@/components/CompanyDashboard";
import Loading from "@/components/Loading";
import { AppDispatch, Rootstate } from "@/store/store";
import { fetchMe } from "@/store/slice/auth/auth";

const CompanyAdmin: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Get auth state from Redux
  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth
  );

  // Local state to ensure minimum loader time
  const [showLoading, setShowLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  // Redirect if not logged in OR not company admin
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== "companyadmin") {
        router.replace("/access-denied");
      } else {
        // Ensure loader shows at least 1.5s
        const timer = setTimeout(() => {
          setShowLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [loading, isAuthenticated, user, router]);

  // Show loader while fetching or minimum timeout
  if (loading || showLoading) return <Loading text="Fetching your data..." />;

  // Prevent render flash
  if (!isAuthenticated || user?.role !== "companyadmin") return null;

  return <CompanyDashboard />;
};

export default CompanyAdmin;
