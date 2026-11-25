import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  FileText,
  Bookmark,
  Building2,
  BarChart3,
  User,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  Calendar,
  Zap,
} from "lucide-react";

export default function Sidebar({
  activeNav,
  setActiveNav,
  mobileOpen,
  setMobileOpen,
  user,
  onOpenProfile,
  onOpenSettings,
  onOpenAutoApply,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "discover", label: "Discover Jobs", icon: Compass, to: "/jobs" },
    { id: "applications", label: "My Applications", icon: FileText, to: "/my-applications" },
    { id: "interviews", label: "Interviews", icon: Calendar, to: "/interviews" },
    { id: "auto-apply", label: "Auto Apply Rules", icon: Zap, action: onOpenAutoApply },
    { id: "saved", label: "Saved Jobs", icon: Bookmark, badge: "4" },
    { id: "companies", label: "Companies", icon: Building2, to: "/companies" },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "profile", label: "My Profile", icon: User, action: onOpenProfile },
    { id: "settings", label: "Settings", icon: Settings, action: onOpenSettings },
  ];

  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.to) {
      navigate(item.to);
    } else {
      setActiveNav(item.id);
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/90 bg-[#FFFFFF] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 px-5">
          <Link
            to="/student-dashboard"
            className="group flex items-center gap-3 transition-opacity hover:opacity-95"
            onClick={() => {
              setActiveNav("overview");
              setMobileOpen(false);
            }}
          >
            {/* Minimalist Human Mark */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs transition-transform group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900">
                Campus<span className="text-slate-600 font-semibold">Connect</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
                Student Workspace
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Platform Navigation
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {/* Subtle active left indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-[#145A42]" />
                  )}

                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-slate-900"
                        : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />

                  <span className="flex-1 truncate">{item.label}</span>

                  {item.badge && (
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Professional Status Widget inside Sidebar */}
          <div className="mt-8 rounded-lg border border-slate-200/80 bg-slate-50/70 p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#145A42]" />
              <span className="text-xs font-semibold text-slate-900">Placement Verified</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              Your profile is verified and active for university campus hiring rounds.
            </p>
            <button
              type="button"
              onClick={onOpenProfile}
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-md bg-[#145A42] hover:bg-[#0E3D2D] px-2.5 py-1.5 text-[11px] font-bold text-white transition-all shadow-xs"
            >
              <span>Manage Profile</span>
              <ArrowRight className="h-3 w-3 text-emerald-300" />
            </button>
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="shrink-0 border-t border-slate-200/80 p-3">
          <div className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50">
            <div
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5"
              onClick={onOpenProfile}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white">
                {user?.fullname
                  ? user.fullname
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "RK"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">
                  {user?.fullname || "Rajesh Kumar"}
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  {user?.email || "rajesh.k@campus.edu"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
