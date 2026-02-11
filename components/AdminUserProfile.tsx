"use client";

import {
  MapPin,
  Phone,
  Briefcase,
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  Twitter,
  Calendar,
  Ban,
  Unlock,
  Mail,
} from "lucide-react";
export interface AdminUserProfile {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  phone: string;
  gender: string;
  headline: string;
  bio: string;
  experience: number;
  education: string;
  skills: string[];
  photoUrl: string;
  resumeUrl: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  socials: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
  };
  createdAt: string;
  isProfileComplete: boolean;

userId:{
    email:string
    isblocked?: boolean;
}}

interface Props {
  userData: AdminUserProfile;
  onBlock: (id: string) => void;
  onUnblock: (id: string) => void;
}

export default function AdminUserProfileView({
  userData,
  onBlock,
  onUnblock,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img
          src={userData.photoUrl}
          alt="Profile"
          className="w-32 h-32 rounded-2xl object-cover border"
        />

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">
            {userData.firstName} {userData.middleName} {userData.lastName}
          </h2>

          <p className="text-sky-600 font-medium mt-1">
            {userData.headline}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-3">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {userData.location.city}, {userData.location.state},{" "}
              {userData.location.country}
            </span>

            <span className="flex items-center gap-1">
              <Phone size={14} />
              {userData.phone}
            </span>
<span className="flex items-center gap-1">
              <Mail size={14} />
              {userData.userId.email}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={14} />
              {userData.experience} year(s)
            </span>

            <span className="flex items-center gap-1">
              <GraduationCap size={14} />
              {userData.education}
            </span>
          </div>

          <div className="mt-3">
            <a
              href={userData.resumeUrl}
              target="_blank"
              className="text-sm text-sky-600 underline"
            >
              View Resume
            </a>
          </div>
        </div>

        {/* ================= ADMIN ACTIONS ================= */}
        <div className="flex gap-3">
          {userData.userId.isblocked ? (
            <button
              onClick={() => onUnblock(userData._id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-green-500 text-green-600 hover:bg-green-50"
            >
              <Unlock size={16} />
              Unblock
            </button>
          ) : (
            <button
              onClick={() => onBlock(userData._id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50"
            >
              <Ban size={16} />
              Block
            </button>
          )}
        </div>
      </div>

      {/* ================= BIO ================= */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          About
        </h3>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
          {userData.bio}
        </p>
      </div>

      {/* ================= SKILLS ================= */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {userData.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ================= SOCIALS ================= */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">
          Social Links
        </h3>

        <div className="flex gap-4 text-slate-600">
          {userData.socials.github && (
            <a href={userData.socials.github} target="_blank">
              <Github />
            </a>
          )}
          {userData.socials.linkedin && (
            <a href={userData.socials.linkedin} target="_blank">
              <Linkedin />
            </a>
          )}
          {userData.socials.portfolio && (
            <a href={userData.socials.portfolio} target="_blank">
              <Globe />
            </a>
          )}
          {userData.socials.twitter && (
            <a href={userData.socials.twitter} target="_blank">
              <Twitter />
            </a>
          )}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-8 pt-6 border-t text-sm text-slate-500 flex items-center gap-2">
        <Calendar size={14} />
        Joined on {new Date(userData.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
