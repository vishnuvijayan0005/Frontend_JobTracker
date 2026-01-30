"use client";

import Loading from "@/components/Loading";
import UserNavbar from "@/components/UserNavbar";
import UserProfileForm from "@/components/Userprofileform";
import { fetchMe } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";
import api from "@/utils/baseUrl";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Userprofile = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth,
  );

  const [showLoading, setShowLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    location: {
      city: "",
      state: "",
      country: "",
    },
    headline: "",
    bio: "",
    skills: "",
    experience: "",
    resume: null as File | null,
    gender: "",
    education: "",

    photo: null as File | null,
    photoPreview: "",
    socials: {
      linkedin: "",
      github: "",
      portfolio: "",
      twitter: "",
    },
  });

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "user") {
      router.replace("/access-denied");
      return;
    }

    const timer = setTimeout(() => setShowLoading(false), 500);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      if (form.photo) formData.append("photo", form.photo);
      if (form.resume) formData.append("resume", form.resume);

      formData.append("firstName", form.firstName);
      formData.append("middleName", form.middleName);
      formData.append("lastName", form.lastName);
      formData.append("phone", form.phone);
      formData.append("headline", form.headline);
      formData.append("bio", form.bio);
      formData.append("experience", form.experience);
      formData.append("education", form.education);
      formData.append("gender", form.gender);
      formData.append("skills", form.skills);

      formData.append("location", JSON.stringify(form.location));
      formData.append("socials", JSON.stringify(form.socials));

      const res = await api.post("/user/addprofile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile saved successfully!");
      router.push("/user");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading || showLoading) return <Loading text="Fetching your data..." />;

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
        <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
        <UserProfileForm
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Userprofile;
