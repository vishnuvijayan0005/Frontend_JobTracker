"use client"
import AdminDashboard from '@/components/AdminDashboard'
import Loading from '@/components/Loading';
import api from '@/utils/baseUrl';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function admin() {
     const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/admin", {
          withCredentials: true,
        });

        // Unauthorized
        if (!res.data?.success) {
          router.replace("/access-denied");
          return;
        }

        // Authorized → show loader briefly for UX
        setTimeout(() => {
          setLoading(false);
        }, 1500);

      } catch (err: any) {
        // Only redirect, no console error
        if (err.response?.status === 401) {
          router.replace("/access-denied");
        }
      }
    };

    fetchUser();
  }, [router]);
   if (loading) {
    return <Loading text="Fetching your data..." />;
  }
  return (
    <div><AdminDashboard/></div>
  )
}

export default admin