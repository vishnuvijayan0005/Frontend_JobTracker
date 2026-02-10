"use client"
import AdminDashboard from '@/components/AdminDashboard'
import Loading from '@/components/Loading';
import { fetchMe } from '@/store/slice/auth/auth';
import { AppDispatch, Rootstate } from '@/store/store';
import api from '@/utils/baseUrl';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function admin() {
     const router = useRouter();


  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuthenticated, user } = useSelector((state: Rootstate) => state.auth);
  const [showLoading, setShowLoading] = useState(true);

  /* ================= AUTH ================= */

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/access-denied");
      return;
    }

    const timer = setTimeout(() => setShowLoading(false), 500);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user, router]);
   if (loading|| showLoading) {
    return <Loading text="Fetching your data..." />;
  }
  return (
    <div><AdminDashboard/></div>
  )
}

export default admin