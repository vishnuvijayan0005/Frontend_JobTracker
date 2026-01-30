"use client";

import Loading from "@/components/Loading";
import UserNavbar from "@/components/UserNavbar";
import { fetchMe } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";
import api from "@/utils/baseUrl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface UserProfile {
  fullName: string;
  headline: string;
  bio: string;
  photo: string;
  location: { city: string; state: string; country: string };
  professional: { label: string; value: any }[];
  contact: { label: string; value: any }[];
  socials: { label: string; url: string }[];
}

const Userprofileview = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, isAuthenticated, user } = useSelector(
    (state: Rootstate) => state.auth,
  );

  const [showLoading, setShowLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || user?.role !== "user") {
      router.replace("/access-denied");
      return;
    }

    const timer = setTimeout(() => setShowLoading(false), 800);
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/user/getuserprofile", {
          withCredentials: true,
        });

        const profileData = response.data.data[0];
        // console.log("Raw profileData:", profileData);

        const formattedProfile: UserProfile = {
          fullName:
            `${profileData.firstName} ${profileData.middleName || ""} ${profileData.lastName}`.trim(),
          headline: profileData.headline,
          bio: profileData.bio,
          photo: profileData.photoUrl || "/avatar-placeholder.png",
          location: profileData.location, // already an object
          professional: [
            { label: "Experience", value: profileData.experience + " years" },
            { label: "Education", value: profileData.education },
            { label: "Skills", value: profileData.skills.join(", ") },
            { label: "Gender", value: profileData.gender },
          ],
          contact: [
            { label: "Phone", value: profileData.phone },
            { label: "Resume", value: profileData.resumeUrl },
          ],
          socials: [
            { label: "LinkedIn", url: profileData.socials.linkedin },
            { label: "GitHub", url: profileData.socials.github },
            { label: "Portfolio", url: profileData.socials.portfolio },
            { label: "Twitter / X", url: profileData.socials.twitter },
          ],
        };

        // console.log("Formatted profile:", formattedProfile);

        setUserProfile(formattedProfile);
      } catch (err) {
        console.error("Error fetching user profile:", err);
         router.replace("/user/profile"); 
      }
    };

    fetchUserInfo();
    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user, router]);

  if (loading || showLoading) {
    return <Loading text="Fetching your profile..." />;
  }

  if (!userProfile) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        {/* ================= HEADER ================= */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-6">
          <img
            src={userProfile.photo}
            alt="Profile"
            className="h-32 w-32 rounded-full object-cover border"
          />

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold">{userProfile.fullName}</h1>
            <p className="text-gray-600 mt-1">{userProfile.headline}</p>
            <p className="text-sm text-gray-500 mt-2">
              {userProfile.location.city}, {userProfile.location.state},{" "}
              {userProfile.location.country}
            </p>
          </div>
        </div>

        {/* ================= ABOUT ================= */}
        <Section title="About">
          <p className="text-gray-700">{userProfile.bio}</p>
        </Section>

        <Section title="Professional Details">
          <Grid cols={2}>
            {userProfile.professional.map((item, index) => (
              <Info key={index} label={item.label} value={item.value} />
            ))}
          </Grid>
        </Section>

        {/* ================= CONTACT ================= */}
        <Section title="Contact Information">
          <Grid cols={2}>
            {userProfile.contact.map((item, index) => (
              <Info
                key={index}
                label={item.label}
                value={
                  item.label === "Resume" && item.value ? (
                    <a
                      href={item.value}
                      target="_blank"
                      className="text-sky-600 hover:underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    item.value || "Not uploaded"
                  )
                }
              />
            ))}
          </Grid>
        </Section>

        {/* ================= SOCIALS ================= */}
        <Section title="Social Profiles">
          <Grid cols={2}>
            {userProfile.socials.map((social, index) => (
              <Social key={index} label={social.label} url={social.url} />
            ))}
          </Grid>
        </Section>
      </main>
    </div>
  );
};

export default Userprofileview;

/* ================= UI HELPERS ================= */

const Section = ({ title, children }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
    <h2 className="text-lg font-semibold border-b pb-2">{title}</h2>
    {children}
  </div>
);

const Grid = ({ cols, children }: any) => (
  <div className={`grid grid-cols-1 sm:grid-cols-${cols} gap-4`}>
    {children}
  </div>
);

const Info = ({ label, value }: any) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

const Social = ({ label, url }: any) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <a
      href={url}
      target="_blank"
      className="text-sky-600 hover:underline break-all"
    >
      {url}
    </a>
  </div>
);
