"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Briefcase,
  Home,
  Menu as MenuIcon,
  UserCircle,
  LogOut,
  Settings,
  Building2,
  X,
  Search,
  FileText,
  MessageCircleCodeIcon,
  MapPin,
  Bookmark,
  Settings2,
} from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import CompanySwitcherModal from "./CompanySwitchmodal";
import { logoutUser } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";
import api from "@/utils/baseUrl";

/* ================= TYPES ================= */
interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
}

export default function UserNavbar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();


  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  /* ===== SEARCH STATE ===== */
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Job[]>([]);
  const [showResults, setShowResults] = useState(false);
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { icon: <Home size={18} />, text: "Home", path: "/user" },
    { icon: <Briefcase size={18} />, text: "Jobs", path: "/user/Jobs" },
    {
      icon: <Building2 size={18} />,
      text: "Companies",
      action: () => setCompanyOpen(true),
    },
    {
      icon: <Bookmark size={18} />,
      text: "Applied Jobs",
      path: "/user/applied",
    },
    {
      icon: <Settings2 size={18} />,
      text: "Profile View",
      path: "/user/profile/profileview",
    },
  ];


useEffect(() => {
  if (!search.trim()) {
    setResults([]);
    setShowResults(false);
    return;
  }

  debounceRef.current = setTimeout(async () => {
    try {
      const res = await api.get("/user/fetchsearch", {
        params: { search, limit: 5 },
      });
      setResults(res.data?.data || []);
      setShowResults(true);
    } catch (err) {
      console.error(err);
    }
  }, 300);

  return () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };
}, [search]);



  useEffect(() => {
    if (mobileOpen) return;

    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);


  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);


  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/");
  };

  const nav = (item: (typeof navItems)[0]) => {
    if (item.action) item.action();
    if (item.path) router.push(item.path);
    setMobileOpen(false);
  };

  const goToJob = (id: string) => {
    setSearch("");
    setShowResults(false);
    setMobileOpen(false);
    router.push(`/user/jobsdetails/${id}`);
  };

  const handleEnterSearch = () => {
    if (!search.trim()) return;
    setShowResults(false);
    setMobileOpen(false);
    router.push(`/user/jobs?search=${encodeURIComponent(search)}`);
    setSearch("");
  };
useEffect(() => {
  setShowResults(false);
}, [router]);




  return (
    <>
   
      <nav className="sticky top-0 z-[1000] w-full bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
       
          <div
            onClick={() => router.push("/user")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <h1 className="text-xl font-bold">CareerNest</h1>
          </div>

         
          <div className="hidden md:flex items-center gap-6 relative">
            {navItems.slice(0, 3).map((item, idx) => (
              <button
                key={idx}
                onClick={() => nav(item)}
                className="flex items-center gap-2 hover:text-sky-600"
              >
                {item.icon} {item.text}
              </button>
            ))}

            <div ref={searchRef} className="relative w-72">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => search && setShowResults(true)}
                  onKeyDown={(e) => e.key === "Enter" && handleEnterSearch()}
                  placeholder="Search jobs..."
                  className="bg-transparent outline-none px-2 text-sm flex-1"
                />
              </div>

         {showResults && (
  <div className="absolute top-12 w-full bg-white rounded-xl shadow-xl border z-50 max-h-80 overflow-auto">
    {results.length === 0 ? (
      <p className="p-4 text-sm text-gray-500 text-center">
        No jobs found
      </p>
    ) : (
      <>
        {results.map((job) => (
          <div
            key={job._id}
            onClick={() => goToJob(job._id)}
            className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
          >
            <p className="font-semibold">{job.title}</p>
            <p className="text-xs text-gray-500">{job.companyName}</p>
            <div className="flex gap-3 text-xs text-gray-400 mt-1">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase size={12} /> {job.jobType}
              </span>
            </div>
          </div>
        ))}

        {/* ✅ VIEW MORE */}
        <button
          onClick={() => {
            setShowResults(false);
            router.push(`/user/jobs?search=${encodeURIComponent(search)}`);
            setSearch("");
          }}
          className="w-full py-3 text-sm font-medium text-sky-600 hover:bg-gray-50 border-t"
        >
          View more jobs →
        </button>
      </>
    )}
  </div>
)}

            </div>

            <Menu as="div" className="relative">
              <MenuButton>
                <UserCircle size={36} />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border">
                <MenuItem>
                  <button
                    onClick={() => router.push("/user/profile/profileview")}
                    className="flex w-full gap-3 px-5 py-2 text-sm"
                  >
                    <Settings size={18} /> Profile
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => router.push("/user/applied")}
                    className="flex w-full gap-3 px-5 py-2 text-sm"
                  >
                    <FileText size={18} /> Applied Jobs
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="flex w-full gap-3 px-5 py-2 text-sm text-red-600"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>

            <MessageCircleCodeIcon />
          </div>

          <button onClick={() => setMobileOpen(true)} className="md:hidden">
            <MenuIcon />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-semibold text-lg">Menu</h2>
              <X onClick={() => setMobileOpen(false)} />
            </div>

            {/* Mobile Search */}
            <div className="px-5 py-4 border-b">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search size={16} />
                <input
                  className="bg-transparent outline-none px-2 text-sm flex-1"
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowResults(true);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleEnterSearch()}
                />
              </div>

              {showResults && (
                <div className="mt-3 bg-white rounded-xl border max-h-64 overflow-auto">
                  {results.map((job) => (
                    <div
                      key={job._id}
                      onClick={() => goToJob(job._id)}
                      className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.companyName}</p>
                    </div>
                  ))}
                     <button
          onClick={()=>router.push("/user/jobs")}
          className="w-full py-3 text-sm font-medium text-sky-600 hover:bg-gray-50"
        >
          View more  →
        </button>
                </div>
              )}
            </div>

            <div className="px-5 py-4 flex flex-col gap-3">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => nav(item)}
                  className="flex gap-3 py-2 text-sm"
                >
                  {item.icon} {item.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <CompanySwitcherModal
        isOpen={companyOpen}
        onClose={() => setCompanyOpen(false)}
      />
    </>
  );
}
