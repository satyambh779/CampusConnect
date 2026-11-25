import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Check,
  Building2,
  Calendar,
  FileCheck2,
  Zap,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/api";

export default function TopNavigation({
  user,
  setMobileOpen,
  searchQuery,
  setSearchQuery,
  onOpenProfile,
  onOpenSettings,
}) {
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Load real notifications from backend
  const fetchNotifs = async () => {
    try {
      const res = await getNotifications();
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // Fallback
      setNotifications([
        {
          _id: "demo-1",
          title: "AI Auto Apply Active",
          message: "Auto Apply successfully scanned campus opportunities.",
          createdAt: new Date().toISOString(),
          read: false,
          type: "auto_apply",
        },
        {
          _id: "demo-2",
          title: "Application Shortlisted",
          message: "You have been shortlisted for the Software Engineer role.",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          type: "shortlisted",
        },
      ]);
      setUnreadCount(2);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // 30s light poll
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (item) => {
    try {
      if (!item.read) {
        await markNotificationRead(item._id);
        setNotifications(
          notifications.map((n) => (n._id === item._id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      if (item.link) {
        navigate(item.link);
        setNotificationOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "auto_apply":
        return <Zap className="h-3.5 w-3.5 text-emerald-600" />;
      case "interview_invite":
      case "interview_rescheduled":
        return <Calendar className="h-3.5 w-3.5 text-sky-600" />;
      case "shortlisted":
        return <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />;
      default:
        return <Building2 className="h-3.5 w-3.5 text-slate-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left side: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Open sidebar navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
            Dashboard Overview
          </h1>
          <span className="hidden text-[11px] text-slate-500 sm:block">
            Autonomous career intelligence & placement portal
          </span>
        </div>
      </div>

      {/* Right side: Search + Notifications + Profile Avatar Dropdown */}
      <div className="flex items-center gap-2.5">
        {/* Search Bar */}
        <div className="relative hidden sm:block w-48 md:w-60">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications..."
            className="h-8.5 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-8.5 pr-8.5 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-slate-400 focus:bg-[#FFFFFF] focus:outline-hidden"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-medium text-slate-400">
            ⌘K
          </kbd>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#145A42] px-1 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-xl border border-slate-200 bg-white p-0 shadow-lg ring-1 ring-black/5 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900"
                  >
                    <Check className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleNotificationClick(item)}
                      className={`flex gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                        !item.read ? "bg-emerald-50/20" : ""
                      }`}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        {getNotifIcon(item.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900 truncate">{item.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-500 leading-snug line-clamp-2">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-100 p-2 text-center">
                <button
                  onClick={() => setNotificationOpen(false)}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-800"
                >
                  Close panel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white p-1 pl-1.5 transition-colors hover:bg-slate-50"
            aria-label="User profile menu"
          >
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-white">
              {user?.fullname
                ? user.fullname
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "RK"}
            </div>
            <span className="hidden text-xs font-semibold text-slate-700 md:block max-w-[90px] truncate">
              {user?.fullname?.split(" ")[0] || "Rajesh"}
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 md:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg ring-1 ring-black/5 z-50">
              <div className="border-b border-slate-100 px-3.5 py-2">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.fullname || "Rajesh Kumar"}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || "rajesh.k@campus.edu"}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenProfile();
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenSettings();
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  Settings
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50/50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
