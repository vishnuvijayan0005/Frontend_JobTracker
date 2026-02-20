"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Briefcase,
  Home,
  Menu as MenuIcon,
  UserCircle,
  LogOut,
  Building2,
  X,
  Search,
  Bookmark,
  Settings2,
  Bell,
  MapPin,
  CheckCheck,
} from "lucide-react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import CompanySwitcherModal from "./CompanySwitchmodal";
import { logoutUser } from "@/store/slice/auth/auth";
import { AppDispatch } from "@/store/store";
import api from "@/utils/baseUrl";

interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
}

export default function UserNavbar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const notifRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Job[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  // Job Alert Form
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [loadingAlert, setLoadingAlert] = useState(false);

  const navItems = [
    { icon: <Home size={18} />, text: "Home", path: "/user" },
    { icon: <Briefcase size={18} />, text: "Jobs", path: "/user/Jobs" },
    { icon: <Building2 size={18} />, text: "Companies", action: () => setCompanyOpen(true) },
    { icon: <Bookmark size={18} />, text: "Applied Jobs", path: "/user/applied" },
    { icon: <Settings2 size={18} />, text: "Profile View", path: "/user/profile/profileview" },
  ];

  /* ================= SEARCH ================= */
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get("/user/fetchsearch", { params: { search, limit: 5 } });
        setResults(res.data?.data || []);
        setShowResults(true);
      } catch (err) { console.error(err); }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  /* ================= SIDE EFFECTS ================= */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || notifOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, notifOpen]);

  /* ================= HANDLERS ================= */
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
    router.push(`/user/jobsdetails/${id}`);
  };

  /* ================= NOTIFICATIONS LOGIC ================= */
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/user/notifications", { withCredentials: true });
      setNotifications(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      await api.patch(`/user/notifications/${id}/read`, {}, { withCredentials: true });
    } catch (err) { 
      console.error(err); 
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      await api.patch(`/user/notifications/read-all`, {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
      fetchNotifications();
    }
  };

  useEffect(() => { fetchNotifications(); }, []);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleCreateJobAlert = async () => {
    if (!keywords.trim()) return;
    setLoadingAlert(true);
    try {
      const res = await api.post("/user/jobalert", {
        keywords: keywords.split(",").map((k) => k.trim()),
        location: location.trim() || undefined,
        jobType: jobType || undefined,
      }, { withCredentials: true });
      if (res.data.success) {
        alert("Job alert created!");
        setKeywords(""); setLocation(""); setJobType("");
        setShowAlertForm(false);
      }
    } catch (err) { alert("Failed to create alert"); } finally { setLoadingAlert(false); }
  };

  /* ================= COMPONENT: NOTIFICATION LIST ================= */
  const NotificationsContent = () => (
    <div className="flex flex-col h-full bg-white">
      {!showAlertForm ? (
        <button
          className="w-full text-left text-blue-600 font-medium hover:text-blue-800 px-4 py-3 border-b bg-blue-50/30 transition-colors"
          onClick={() => setShowAlertForm(true)}
        >
          + Create Custom Job Alert
        </button>
      ) : (
        <div className="flex flex-col gap-2 px-4 py-3 border-b bg-gray-50">
          <input type="text" placeholder="Keywords..." value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
          <input type="text" placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
          <div className="flex justify-end gap-2 mt-1">
            <button className="text-gray-500 text-xs" onClick={() => setShowAlertForm(false)}>Cancel</button>
            <button className="text-blue-600 text-xs font-bold" onClick={handleCreateJobAlert} disabled={loadingAlert}>{loadingAlert ? "Saving..." : "Save"}</button>
          </div>
        </div>
      )}

      {/* MARK ALL AS READ HEADER */}
      {notifications.length > 0 && (
        <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50/50">
          <span className="text-xs font-semibold text-gray-500">Recent</span>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead} 
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition-colors"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          )}
        </div>
      )}

      {notifications.length === 0 ? (
        <p className="p-10 text-center text-gray-500 text-sm">No notifications</p>
      ) : (
        <div className="flex-1 overflow-y-auto max-h-[400px]">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => { markAsRead(n._id); if (n.link) router.push(n.link); }}
              className={`block px-4 py-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
                n.isRead ? "bg-white opacity-75" : "bg-sky-50/50"
              }`}
            >
              <div className="flex justify-between items-start">
                <p className={`text-sm ${n.isRead ? "text-gray-600 font-normal" : "text-gray-900 font-bold"}`}>
                  {n.title}
                </p>
                {!n.isRead && <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />}
              </div>
              <p className={`text-xs mt-1 ${n.isRead ? "text-gray-400" : "text-gray-600"}`}>
                {n.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-[1000] w-full bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div onClick={() => router.push("/user")} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">J</div>
            <h1 className="text-xl font-bold">CareerNest</h1>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.slice(0, 3).map((item, idx) => (
              <button key={idx} onClick={() => nav(item)} className="flex items-center gap-2 hover:text-sky-600 font-medium text-sm text-gray-700">
                {item.icon} {item.text}
              </button>
            ))}

            {/* SEARCH BOX */}
            <div ref={searchRef} className="relative w-64">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search size={16} className="text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => search && setShowResults(true)} placeholder="Search..." className="bg-transparent outline-none px-2 text-sm flex-1" />
              </div>
              {showResults && (
                <div className="absolute top-12 w-full bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                  {results.map((job) => (
                    <div key={job._id} onClick={() => goToJob(job._id)} className="p-3 hover:bg-gray-50 border-b last:border-0 cursor-pointer">
                      <p className="text-sm font-semibold">{job.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* NOTIF DESKTOP */}
            <div ref={notifRef} className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="p-1 relative outline-none">
                <Bell className="h-6 w-6 text-gray-700 hover:text-sky-600 transition-colors" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px] border-2 border-white">{unreadCount}</span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 shadow-2xl rounded-xl border z-50 overflow-hidden">
                  <NotificationsContent />
                </div>
              )}
            </div>

            {/* USER PROFILE DROPDOWN (RESTORED) */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center outline-none">
                <UserCircle size={36} className="text-gray-600 hover:text-sky-600 transition-colors" />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border overflow-hidden z-[1002]">
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => router.push("/user/profile/profileview")}
                      className={`flex w-full px-4 py-3 text-sm font-medium transition-colors ${
                        active ? "bg-gray-50 text-sky-600" : "text-gray-700"
                      }`}
                    >
                      Profile
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => router.push("/user/applied")}
                      className={`flex w-full px-4 py-3 text-sm font-medium transition-colors ${
                        active ? "bg-gray-50 text-sky-600" : "text-gray-700"
                      }`}
                    >
                      Applied Jobs
                    </button>
                  )}
                </MenuItem>
                <div className="border-t border-gray-100" />
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`flex w-full px-4 py-3 text-sm font-medium transition-colors ${
                        active ? "bg-red-50 text-red-700" : "text-red-600"
                      }`}
                    >
                      Logout
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

          {/* MOBILE TOGGLES */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setNotifOpen(true)} className="relative p-1">
              <Bell className="h-6 w-6 text-gray-700" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px]">{unreadCount}</span>}
            </button>
            <button onClick={() => setMobileOpen(true)}><MenuIcon className="h-6 w-6 text-gray-700" /></button>
          </div>
        </div>
      </nav>

      {/* MOBILE NOTIFICATION FULL PANEL */}
      {notifOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setNotifOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-80 bg-white flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg">Notifications</h2>
              <button onClick={() => setNotifOpen(false)}><X className="h-6 w-6 text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-hidden">
              <NotificationsContent />
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU PANEL */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-xl">Menu</h2>
              <button onClick={() => setMobileOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-5">
              {navItems.map((item, idx) => (
                <button key={idx} onClick={() => nav(item)} className="flex items-center gap-4 text-gray-700 font-medium">
                  <span className="text-sky-500">{item.icon}</span> {item.text}
                </button>
              ))}
              <hr />
              <button onClick={handleLogout} className="flex items-center gap-4 text-red-600 font-medium">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <CompanySwitcherModal isOpen={companyOpen} onClose={() => setCompanyOpen(false)} />
    </>
  );
}