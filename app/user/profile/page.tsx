"use client";

import Loading from "@/components/Loading";
import UserNavbar from "@/components/UserNavbar";
import UserProfileForm, {
  UserProfileSubmitDTO,
} from "@/components/Userprofileform";
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
    (state: Rootstate) => state.auth
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
    skills: "", // UI input (comma-separated)
    experience: "",
    resume: null as File | null,
    gender: "",
    education: "",
    photo: null as File|string | null,
    photoPreview: "",
    socials: {
      linkedin: "",
      github: "",
      portfolio: "",
      twitter: "",
    },
  });

  /* ================= AUTH ================= */
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "user") {
      router.replace("/access-denied");
      return;
    }

    const timer = setTimeout(() => setShowLoading(false), 300);
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user, router]);

  /* ================= FETCH PROFILE ================= */
  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/user/getuserprofile", {
        withCredentials: true,
      });

      const profile = res.data?.data?.[0];
      if (!profile) return;

      setForm((prev) => ({
        ...prev,
        firstName: profile.firstName || "",
        middleName: profile.middleName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        skills: Array.isArray(profile.skills)
          ? profile.skills.join(", ")
          : "",
        experience: profile.experience?.toString() || "",
        gender: profile.gender || "",
        education: profile.education || "",
        location: {
          city: profile.location?.city || "",
          state: profile.location?.state || "",
          country: profile.location?.country || "",
        },
        socials: {
          linkedin: profile.socials?.linkedin || "",
          github: profile.socials?.github || "",
          portfolio: profile.socials?.portfolio || "",
          twitter: profile.socials?.twitter || "",
        },
        photoPreview: profile.photoUrl || "",
      }));
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUserProfile();
  }, [isAuthenticated]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (data: UserProfileSubmitDTO) => {
    try {
      const formData = new FormData();

      if (data.photo) formData.append("photo", data.photo);
      if (data.resume) formData.append("resume", data.resume);

      formData.append("firstName", data.firstName);
      formData.append("middleName", data.middleName);
      formData.append("lastName", data.lastName);
      formData.append("phone", data.phone);
      formData.append("headline", data.headline);
      formData.append("bio", data.bio);
      formData.append("experience", String(data.experience));
      formData.append("education", data.education);
      formData.append("gender", data.gender);

 
      formData.append("skills", JSON.stringify(data.skills));

      formData.append("location", JSON.stringify(data.location));
      formData.append("socials", JSON.stringify(data.socials));

      await api.post("/user/addprofile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

// console.log(formData);

      toast.success("Profile saved successfully!");
      router.push("/user");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading || showLoading) {
    return <Loading text="Fetching your data..." />;
  }

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
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Userprofile;
