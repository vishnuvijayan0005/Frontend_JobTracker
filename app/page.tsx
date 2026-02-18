"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import JobSearchPage from "@/components/SearchComponent";
import AutoBanner from "@/components/Autobanner";
import SmallAutoBanner from "@/components/Autobanner";
import Footer from "@/components/Footer";

export default function Home() {
  // const router = useRouter();

  // useEffect(() => {
  //   router.replace("/user"); 
  // }, [router]);

  return <>
   <Navbar/>
   <JobSearchPage/>
   <div className="pb-16 px-2">
  <SmallAutoBanner
        images={[
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&h=300&q=80",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&h=300&q=80",
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&h=300&q=80",
        ]}
      />
      </div>
<Footer/>
  </>; 
}