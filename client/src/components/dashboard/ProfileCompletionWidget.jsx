import React from "react";
import { Check, AlertCircle, ArrowRight, UserCheck } from "lucide-react";

export default function ProfileCompletionWidget({
  user,
  onOpenProfile,
}) {
  const percentage = 85;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const checklist = [
    { id: "resume", label: "Resume uploaded", completed: true, detail: "Rajesh_CV_2026.pdf" },
    { id: "skills", label: "Skills added", completed: true, detail: "React, TS, Node, Tailwind" },
    { id: "education", label: "Education completed", completed: true, detail: "B.Tech Computer Science" },
    { id: "photo", label: "Profile photo", completed: false, detail: "Add a friendly professional photo" },
  ];

  return (
    <div className="rounded-xl border border-slate-200/90 bg-[#FFFFFF] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-slate-900">
            Profile Completion
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Complete your profile to increase recruiter response rates
          </p>
        </div>
        <span className="rounded-md border border-slate-200 bg-slate-50 p-1.5 text-slate-600">
          <UserCheck className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Progress & Circular Indicator */}
      <div className="mt-4 flex items-center gap-5">
        {/* SVG Circular Progress Ring */}
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
          <svg className="h-20 w-20 -rotate-90 transform" viewBox="0 0 80 80">
            {/* Background Track */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#F1F5F9"
              strokeWidth="5.5"
              fill="transparent"
            />
            {/* Active Arc (Deep Slate) */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#0F172A"
              strokeWidth="5.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-slate-900 font-mono">
              {percentage}%
            </span>
            <span className="text-[9px] uppercase font-semibold text-slate-400">
              Done
            </span>
          </div>
        </div>

        {/* Status blurb */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-800">
            Almost there - 1 item pending
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Profiles with a photo receive up to <strong className="text-slate-900">3.5x</strong> more recruiter profile views.
          </p>
        </div>
      </div>

      {/* Checklist items */}
      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3.5">
        {checklist.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-xs py-1"
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                  item.completed
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {item.completed ? (
                  <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                ) : (
                  <AlertCircle className="h-2.5 w-2.5" />
                )}
              </span>
              <span
                className={`font-medium ${
                  item.completed ? "text-slate-800" : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
              {item.detail}
            </span>
          </div>
        ))}
      </div>

      {/* Create / Complete Profile Action Button */}
      <button
        type="button"
        onClick={onOpenProfile}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#145A42] hover:bg-[#0E3D2D] py-2.5 px-4 text-xs font-bold text-white shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0"
      >
        <span>Complete / Edit Profile</span>
        <ArrowRight className="h-3.5 w-3.5 text-emerald-300" />
      </button>
    </div>
  );
}
