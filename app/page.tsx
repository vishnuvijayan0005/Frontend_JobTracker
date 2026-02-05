"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import JobSearchPage from "@/components/SearchComponent";

export default function Home() {
  // const router = useRouter();

  // useEffect(() => {
  //   router.replace("/user"); 
  // }, [router]);

  return <>
   <Navbar/>
   <JobSearchPage/>
  </>; 
}