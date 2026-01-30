"use client";

import { useState, useEffect } from "react";
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
  Bookmark,
  X,
  Search,
  Icon,
  FileText,
} from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import Loading from "./Loading";
import CompanySwitcherModal from "./CompanySwitchmodal";
import { logoutUser } from "@/store/slice/auth/auth";
import { AppDispatch, Rootstate } from "@/store/store";

export default function UserNavbar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: Rootstate) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navItems = [
    { icon: <Home size={18} />, text: "Home", path: "/user" },
    { icon: <Briefcase size={18} />, text: "Jobs", path: "/user/Jobs" },
    {
      icon: <Building2 size={18} />,
      text: "Companies",
      action: () => setCompanyOpen(true),
    },

  ];

useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setMobileOpen(false);
      document.body.style.overflow = "";
    }
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace("/");
  };
  const nav = (item: (typeof navItems)[0]) => {
    if (item.action) {
      item.action();
      setMobileOpen(false);
      return;
    }

    if (item.path) {
      router.push(item.path);
      setCompanyOpen(false);
      setMobileOpen(false);
    }
  };

  if (loading) return <Loading text="Loading..." />;
  if (!user) return null;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-[1000] w-full bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <h1 className="text-xl font-bold">JobTracker</h1>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => nav(item)}
                className="flex items-center gap-2 hover:text-sky-600"
              >
                {item.icon} {item.text}
              </button>
            ))}

            {/* Search */}
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 max-w-xs w-full">
              <Search size={16} className="text-gray-500" />
              <input
                className="bg-transparent outline-none px-2 text-sm flex-1"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(router, search, setSearch)
                }
              />
            </div>

            {/* Profile */}
            <Menu as="div" className="relative">
              <MenuButton className="p-1 rounded-full hover:bg-gray-100">
                <UserCircle size={36} />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-xl border z-[9999]">
                <div className="px-5 py-4 bg-gray-50 border-b">
                  <p className="font-semibold text-sm truncate">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.name}</p>
                </div>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => router.push("/user/profile/profileview")}
                      className={`flex w-full items-center gap-3 px-5 py-2 text-sm ${
                        active ? "bg-sky-50" : ""
                      }`}
                    >
                      <Settings size={18} /> Profile
                    </button>
                  )}
                </MenuItem>

   
     <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => router.push("/saved-jobs")}
                      className={`flex w-full items-center gap-3 px-5 py-2 text-sm ${
                        active ? "bg-sky-50" : ""
                      }`}
                    >
                     <Bookmark size={18} />Saved Jobs
                    </button>
                  )}
                </MenuItem>
                 <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => router.push("/applied-jobs")}
                      className={`flex w-full items-center gap-3 px-5 py-2 text-sm ${
                        active ? "bg-sky-50" : ""
                      }`}
                    >
                     <FileText size={18}/>Applied Jobs
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`flex w-full items-center gap-3 px-5 py-2 text-sm text-red-600 ${
                        active ? "bg-red-50" : ""
                      }`}
                    >
                      <LogOut size={18} /> Logout
                    </button>

                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden"
          >
            {mobileOpen ? <X /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-80 sm:w-72 bg-white shadow-xl p-6 flex flex-col gap-4 overflow-y-auto">
            {/* USER INFO + PROFILE */}
            <div className="flex flex-col border-b pb-3 gap-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm truncate">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <button onClick={() => setMobileOpen(false)}>
                  <X />
                </button>
              </div>

              <button
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm"
              >
                <Settings size={16} /> Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-50 text-sm text-red-600"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

            {/* NAV LINKS */}
            {navItems.map((item, idx) => (
              <MobileBtn
                key={idx}
                icon={item.icon}
                text={item.text}
                onClick={() => nav(item)}
              />
            ))}

            {/* Mobile Search */}
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mt-3 w-full">
              <Search size={16} />
              <input
                className="bg-transparent outline-none px-2 text-sm flex-1"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(router, search, setSearch)
                }
              />
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

/* ================= HELPERS ================= */
function handleSearch(router: any, search: string, setSearch: any) {
  if (!search.trim()) return;
  router.push(`/jobs?search=${encodeURIComponent(search)}`);
  setSearch("");
}

function MobileBtn({ icon, text, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 py-2 text-sm w-full"
    >
      {icon} {text}
    </button>
  );
}
