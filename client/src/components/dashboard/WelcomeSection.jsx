import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, FileDown, User } from "lucide-react";

export default function WelcomeSection({
  user,
  timeRange,
  setTimeRange,
  onOpenProfile,
}) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.fullname?.split(" ")[0] || "Rajesh";
  const greeting = `${getGreeting()}, ${firstName}`;

  const timeRanges = [
    { id: "7d", label: "7 days" },
    { id: "30d", label: "30 days" },
    { id: "90d", label: "90 days" },
    { id: "1y", label: "1 year" },
  ];

  return (
    <div className="rounded-xl border border-slate-200/90 bg-[#FFFFFF] p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            {greeting}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Here is your career progress and application performance at a glance.
          </p>
        </div>

        {/* Actions: Time Filter, PDF Download & Primary Explore Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Subtle segmented control */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100/70 p-0.5 text-xs">
            {timeRanges.map((range) => {
              const isSelected = timeRange === range.id;
              return (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setTimeRange(range.id)}
                  className={`rounded-md px-2.5 py-1 text-xs transition-all ${
                    isSelected
                      ? "bg-white text-slate-900 font-semibold shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>

          {/* Project PDF Download button */}
          <a
            href="/CampusConnect_Project_Documentation.pdf"
            download="CampusConnect_Project_Documentation.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900"
            title="Download full project documentation PDF"
          >
            <FileDown className="h-3.5 w-3.5 text-slate-500" />
            <span>Download Project PDF</span>
          </a>

          {/* High-Visibility Student Profile Button */}
          {onOpenProfile && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs transition-all hover:border-[#145A42] hover:text-[#145A42] hover:bg-emerald-50/30"
              title="Open and update your student profile"
            >
              <User className="h-3.5 w-3.5 text-[#145A42]" />
              <span>My Profile</span>
            </button>
          )}

          {/* Primary Explore Opportunities button */}
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-lg bg-[#145A42] px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#0E3D2D] active:scale-[0.99] shadow-xs"
          >
            <Compass className="h-3.5 w-3.5 text-emerald-300" />
            <span>Explore Opportunities</span>
            <ArrowRight className="h-3 w-3 text-emerald-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
