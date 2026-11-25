import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export default function RecentApplicationsTable({
  realApplications = [],
  loading = false,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  // Benchmark applications as required by prompt
  const benchmarkApplications = [
    {
      id: "bm-1",
      company: "Company A",
      companyFull: "Company A (Acme Corp)",
      position: "Frontend Intern",
      appliedDate: "18 Nov",
      dateTimestamp: new Date("2026-11-18").getTime(),
      status: "Pending",
      department: "Engineering",
      location: "San Francisco, CA (Remote)",
      logoText: "CA",
    },
    {
      id: "bm-2",
      company: "Company B",
      companyFull: "Company B (Linear Systems)",
      position: "Data Analyst",
      appliedDate: "16 Nov",
      dateTimestamp: new Date("2026-11-16").getTime(),
      status: "Accepted",
      department: "Analytics",
      location: "New York, NY (Hybrid)",
      logoText: "CB",
    },
    {
      id: "bm-3",
      company: "Company C",
      companyFull: "Company C (DesignLabs)",
      position: "UI/UX Intern",
      appliedDate: "14 Nov",
      dateTimestamp: new Date("2026-11-14").getTime(),
      status: "Rejected",
      department: "Product Design",
      location: "Bengaluru, India (On-site)",
      logoText: "CC",
    },
    {
      id: "bm-4",
      company: "Company D",
      companyFull: "Company D (CloudScale)",
      position: "Software Engineer",
      appliedDate: "12 Nov",
      dateTimestamp: new Date("2026-11-12").getTime(),
      status: "Shortlisted",
      department: "Infrastructure",
      location: "Austin, TX (Remote)",
      logoText: "CD",
    },
  ];

  // Merge real MongoDB applications
  const combinedData = useMemo(() => {
    const formattedReal = (realApplications || []).map((app) => ({
      id: app._id,
      company: app.job?.company?.name || "Campus Partner",
      companyFull: app.job?.company?.name || "Campus Partner",
      position: app.job?.title || "Candidate Role",
      appliedDate: app.createdAt
        ? new Date(app.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        : "Recent",
      dateTimestamp: app.createdAt ? new Date(app.createdAt).getTime() : Date.now(),
      status: app.status || "Pending",
      department: "General",
      location: app.job?.location || "Flexible",
      logoText: (app.job?.company?.name?.charAt(0) || "C").toUpperCase(),
      jobId: app.job?._id,
    }));

    return [...formattedReal, ...benchmarkApplications];
  }, [realApplications]);

  // Filtering
  const filteredData = useMemo(() => {
    return combinedData.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.position.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [combinedData, searchQuery, statusFilter]);

  // Sorting
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortOrder === "newest") return b.dateTimestamp - a.dateTimestamp;
      if (sortOrder === "oldest") return a.dateTimestamp - b.dateTimestamp;
      if (sortOrder === "company") return a.company.localeCompare(b.company);
      return 0;
    });
  }, [filteredData, sortOrder]);

  // Restrained Status Badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200/70",
          icon: CheckCircle2,
        };
      case "Shortlisted":
        return {
          bg: "bg-slate-100",
          text: "text-slate-800",
          border: "border-slate-200",
          icon: FileCheck2,
        };
      case "Rejected":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200/70",
          icon: XCircle,
        };
      case "Pending":
      default:
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200/70",
          icon: Clock,
        };
    }
  };

  const statusOptions = ["All", "Pending", "Accepted", "Rejected", "Shortlisted"];

  return (
    <div className="rounded-xl border border-slate-200/90 bg-[#FFFFFF] shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight text-slate-900">
              Recent Applications
            </h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {sortedData.length} records
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Track submitted applications, pipeline movements and decisions
          </p>
        </div>

        {/* View all applications link */}
        <Link
          to="/my-applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
        >
          View all applications
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Control Strip */}
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by company or role..."
            className="h-8 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-hidden"
          />
        </div>

        {/* Status Pills & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
            {statusOptions.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  statusFilter === st
                    ? "bg-slate-900 text-white font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-500">
            <ArrowUpDown className="mr-1.5 h-3 w-3 text-slate-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent text-slate-800 font-medium outline-hidden cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="company">Company (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-2.5 px-5">Company</th>
              <th className="py-2.5 px-5">Position</th>
              <th className="py-2.5 px-5">Applied Date</th>
              <th className="py-2.5 px-5">Status</th>
              <th className="py-2.5 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-slate-500">
                  No applications match your current filters.
                </td>
              </tr>
            ) : (
              sortedData.map((row) => {
                const badge = getStatusBadge(row.status);
                const BadgeIcon = badge.icon;

                return (
                  <tr
                    key={row.id}
                    className="group transition-colors hover:bg-slate-50/70"
                  >
                    {/* Company */}
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 font-mono text-xs font-bold text-slate-700">
                          {row.logoText}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {row.company}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {row.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="py-3 px-5">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {row.position}
                        </p>
                        <span className="text-[11px] text-slate-500">
                          {row.department}
                        </span>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="py-3 px-5 text-slate-700 font-mono text-[11px]">
                      {row.appliedDate}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        <BadgeIcon className="h-3 w-3" />
                        {row.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-5 text-right">
                      {row.jobId ? (
                        <Link
                          to={`/job/${row.jobId}`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          View
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        </Link>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Archived
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
