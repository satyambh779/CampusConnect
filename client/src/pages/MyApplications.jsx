import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBriefcase,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaTimesCircle,
  FaBolt,
  FaFilter,
} from "react-icons/fa";
import { getMyApplications } from "../services/api";

export default function MyApplications() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(Boolean(user?._id));
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'highest_match'

  useEffect(() => {
    let cancelled = false;

    const fetchApplications = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const res = await getMyApplications(user._id);
        if (!cancelled) {
          setApplications(res.data.applications || []);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load applications. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchApplications();

    return () => {
      cancelled = true;
    };
  }, [user?._id]);

  // Counts across statuses
  const counts = useMemo(() => {
    const res = {
      All: applications.length,
      AutoApplied: 0,
      Manual: 0,
      Shortlisted: 0,
      Interview: 0,
      Accepted: 0,
      Rejected: 0,
    };

    applications.forEach((app) => {
      const isAuto = app.applicationMethod === "Automatic" || app.status === "Applied Automatically";
      if (isAuto) res.AutoApplied++;
      else res.Manual++;

      if (app.status === "Shortlisted") res.Shortlisted++;
      if (app.status?.includes("Interview")) res.Interview++;
      if (app.status === "Accepted" || app.status === "Selected") res.Accepted++;
      if (app.status === "Rejected") res.Rejected++;
    });

    return res;
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = applications.filter((application) => {
      const job = application.job || {};

      const matchesSearch =
        !query ||
        job.title?.toLowerCase().includes(query) ||
        job.company?.name?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (application.status || "Pending") === statusFilter;

      const isAuto =
        application.applicationMethod === "Automatic" ||
        application.status === "Applied Automatically";

      const matchesMethod =
        methodFilter === "All" ||
        (methodFilter === "Automatic" && isAuto) ||
        (methodFilter === "Manual" && !isAuto);

      return matchesSearch && matchesStatus && matchesMethod;
    });

    return list.sort((a, b) => {
      if (sortBy === "highest_match") {
        const scoreA = Number(a.matchScore || a.matchBreakdown?.matchScore || 0);
        const scoreB = Number(b.matchScore || b.matchBreakdown?.matchScore || 0);
        return scoreB - scoreA;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [applications, search, statusFilter, methodFilter, sortBy]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Shortlisted":
        return <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">Shortlisted</span>;
      case "Interview Requested":
      case "Interview Scheduled":
        return <span className="rounded bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-800 border border-sky-200">{status}</span>;
      case "Selected":
      case "Accepted":
        return <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">Selected / Offer</span>;
      case "Rejected":
        return <span className="rounded bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">Rejected</span>;
      case "Applied Automatically":
        return <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">Applied Automatically</span>;
      default:
        return <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">{status || "Under Review"}</span>;
    }
  };

  return (
    <div className="page-shell space-y-7">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="eyebrow inline-flex items-center gap-1.5">
              <FaBriefcase /> Application Intelligence
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Application Tracking Dashboard
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl">
              Real-time monitoring of manual and auto-submitted applications, compatibility percentages, and employer progression.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/interviews" className="button-secondary text-xs inline-flex items-center gap-1.5">
              <FaCalendarAlt /> My Interviews
            </Link>
            <Link to="/jobs" className="button-primary text-xs inline-flex items-center gap-1.5">
              Browse Roles <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Applications", value: counts.All, color: "text-slate-900", icon: FaBriefcase },
          { label: "Auto Applied", value: counts.AutoApplied, color: "text-[#145A42]", icon: FaBolt },
          { label: "Shortlisted Roles", value: counts.Shortlisted, color: "text-emerald-700", icon: FaCheckCircle },
          { label: "Active Interviews", value: counts.Interview, color: "text-sky-700", icon: FaCalendarAlt },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="surface-card p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500">{item.label}</span>
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-slate-100 bg-slate-50 text-slate-700">
                  <Icon className="text-xs" />
                </span>
              </div>
              <p className={`mt-3 font-mono text-2xl sm:text-3xl font-extrabold ${item.color}`}>
                {item.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Search and Filters */}
      <section className="surface-card p-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Search Position / Company</label>
            <div className="relative">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by job title or company..."
                className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs outline-hidden focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-hidden focus:border-slate-400"
            >
              <option value="All">All Statuses ({applications.length})</option>
              <option value="Applied Automatically">Applied Automatically</option>
              <option value="Applied Manually">Applied Manually</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Requested">Interview Requested</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Rejected">Rejected</option>
              <option value="Selected">Selected</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Application Method</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-hidden focus:border-slate-400"
            >
              <option value="All">All Methods</option>
              <option value="Automatic">⚡ Auto Apply Only</option>
              <option value="Manual">Manual Submissions</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-hidden focus:border-slate-400"
            >
              <option value="newest">Most Recent</option>
              <option value="highest_match">Highest Match Score</option>
            </select>
          </div>
        </div>
      </section>

      {/* Applications List */}
      <section className="space-y-4">
        {loading ? (
          <div className="surface-card p-12 text-center text-xs text-slate-500">Loading your applications...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="surface-card p-12 text-center">
            <FaBriefcase className="mx-auto text-3xl text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-800">No applications found</h3>
            <p className="mt-1 text-xs text-slate-500">
              {applications.length === 0
                ? "Your applications will appear here as soon as you apply or Auto Apply matches roles."
                : "No applications matched your filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredApplications.map((app) => {
              const job = app.job || {};
              const company = job.company || {};
              const matchScore = Number(app.matchScore || app.matchBreakdown?.matchScore || 78);
              const isAuto = app.applicationMethod === "Automatic" || app.status === "Applied Automatically";

              return (
                <article
                  key={app._id}
                  className="surface-card p-5 transition hover:border-slate-300 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left: Company & Job details */}
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-xl font-extrabold text-slate-800">
                        {company.name?.charAt(0) || "C"}
                      </span>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-900">{company.name || "Campus partner"}</p>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isAuto
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {isAuto ? "⚡ Auto Applied" : "Manual Application"}
                          </span>
                        </div>

                        <h3 className="mt-1 text-base font-extrabold tracking-tight text-slate-900">
                          {job.title || "Opportunity"}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <FaMapMarkerAlt className="text-slate-400" />
                            {job.location || "Flexible"}
                          </span>
                          <span>•</span>
                          <span>{job.jobType || "Full-Time"}</span>
                          <span>•</span>
                          <span>
                            Applied{" "}
                            {new Date(app.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Match Score & Status Badge */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">AI Compatibility:</span>
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                            matchScore >= 85
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : matchScore >= 70
                              ? "bg-slate-100 text-slate-800 border border-slate-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {matchScore}% Match
                        </span>
                      </div>

                      <div>{getStatusBadge(app.status)}</div>
                    </div>
                  </div>

                  {/* Status History Note if available */}
                  {app.statusHistory?.length > 1 && (
                    <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-700">Latest Pipeline Update:</span>{" "}
                      {app.statusHistory[app.statusHistory.length - 1].note}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
