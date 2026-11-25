import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  Check,
} from "lucide-react";

export default function RecommendedOpportunities({
  realJobs = [],
  onApply,
}) {
  const [appliedJobs, setAppliedJobs] = useState({});

  const defaultOpportunities = [
    {
      id: "rec-1",
      title: "Product Engineer Intern",
      company: "Linear",
      logo: "L",
      location: "San Francisco, CA",
      workMode: "Remote",
      type: "Internship",
      matchScore: 96,
      salary: "$55 - $70/hr",
    },
    {
      id: "rec-2",
      title: "Frontend Developer (React)",
      company: "Stripe",
      logo: "S",
      location: "Seattle, WA",
      workMode: "Hybrid",
      type: "Full-Time",
      matchScore: 94,
      salary: "$120k - $145k",
    },
    {
      id: "rec-3",
      title: "UI Engineer & Design Systems",
      company: "Notion",
      logo: "N",
      location: "New York, NY",
      workMode: "On-site",
      type: "Internship",
      matchScore: 89,
      salary: "$50 - $65/hr",
    },
  ];

  const formattedRealJobs = (realJobs || []).slice(0, 3).map((job, idx) => ({
    id: job._id,
    title: job.title,
    company: job.company?.name || "Campus Partner",
    logo: (job.company?.name?.charAt(0) || "C").toUpperCase(),
    location: job.location || "Flexible",
    workMode: job.jobType === "Remote" ? "Remote" : "Hybrid",
    type: job.jobType || "Full-Time",
    matchScore: 95 - idx * 3,
    salary: job.salary ? `₹${job.salary.toLocaleString()}` : "Competitive",
    isReal: true,
  }));

  const opportunities = formattedRealJobs.length > 0 ? formattedRealJobs : defaultOpportunities;

  const handleApplyClick = (id) => {
    setAppliedJobs((prev) => ({ ...prev, [id]: true }));
    if (onApply) onApply(id);
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-[#FFFFFF] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-slate-900">
            Recommended Opportunities
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Tailored roles based on your React, TypeScript, and UI/UX profile
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Opportunities List */}
      <div className="mt-4 divide-y divide-slate-100">
        {opportunities.map((item) => {
          const isApplied = appliedJobs[item.id];

          return (
            <div
              key={item.id}
              className="group flex flex-col gap-3 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-slate-50/70 -mx-2 px-2 rounded-lg"
            >
              {/* Left Details */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 font-mono text-xs font-bold text-slate-700">
                  {item.logo}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.title}
                    </h4>
                    {/* Neutral Match Badge */}
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700">
                      {item.matchScore}% match
                    </span>
                  </div>

                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {item.company} • {item.salary}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {item.location}
                    </span>
                    <span>•</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 font-medium">
                      {item.workMode}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600 font-medium">
                      {item.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 sm:self-center">
                {item.isReal ? (
                  <Link
                    to={`/job/${item.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    View Role
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApplyClick(item.id)}
                    disabled={isApplied}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      isApplied
                        ? "bg-slate-100 text-slate-700 cursor-default"
                        : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Applied
                      </>
                    ) : (
                      <>Apply Now</>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
