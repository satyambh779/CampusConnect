import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExternalLinkAlt,
  FaFilter,
  FaGraduationCap,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTimesCircle,
  FaUserCheck,
  FaUsers,
  FaVideo,
} from "react-icons/fa";
import {
  getCompanies,
  getJobs,
  getApplicants,
  updateApplicationStatus,
  sendInterviewInvitation,
  getRecruiterInterviews,
  updateInterviewStatus,
} from "../services/api";

export default function RecruiterDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const firstName = user?.fullname?.split(" ")[0] || "Recruiter";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);

  // Active view tab
  const [activeTab, setActiveTab] = useState("applicants"); // 'applicants' | 'interviews' | 'jobs'

  // Filters
  const [selectedJobId, setSelectedJobId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cgpaFilter, setCgpaFilter] = useState("all");
  const [matchScoreFilter, setMatchScoreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Interview invitation modal state
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: "",
    interviewTime: "11:00 AM",
    interviewMode: "Online",
    meetingLinkOrLocation: "https://meet.google.com/new",
    round: "Technical",
    message: "We were impressed with your profile and would love to speak with you.",
    additionalInstructions: "Please prepare to walk through your recent projects.",
  });
  const [submittingInvite, setSubmittingInvite] = useState(false);

  // Candidate comparison modal state
  const [candidateModal, setCandidateModal] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [companyRes, jobsRes, interviewsRes] = await Promise.all([
        getCompanies(user?._id),
        getJobs(),
        getRecruiterInterviews(),
      ]);

      const myCompanies = companyRes.data.companies || [];
      const allJobs = jobsRes.data.jobs || [];
      const myInterviews = interviewsRes.data?.interviews || [];

      setCompanies(myCompanies);
      setInterviews(myInterviews);

      const filteredJobs = allJobs.filter((job) => {
        const creatorId =
          typeof job.created_by === "object" ? job.created_by?._id : job.created_by;
        return String(creatorId || "") === String(user?._id || "");
      });
      setRecruiterJobs(filteredJobs);

      // Load applicants across all recruiter jobs
      const applicantPromises = filteredJobs.map(async (job) => {
        try {
          const res = await getApplicants(job._id);
          return (res.data.applicants || []).map((app) => ({
            ...app,
            jobDetails: job,
          }));
        } catch {
          return [];
        }
      });

      const applicantGroups = await Promise.all(applicantPromises);
      const flattened = applicantGroups.flat();
      setAllApplications(flattened);
    } catch (err) {
      console.error(err);
      setError("Unable to load recruiter workspace data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?._id]);

  // Derived filtered applicants
  const filteredApplicants = useMemo(() => {
    return allApplications.filter((app) => {
      const applicant = app.applicant || {};
      const job = app.jobDetails || {};
      const profile = applicant.profile || {};

      // Job Filter
      if (selectedJobId !== "all" && String(job._id) !== selectedJobId) {
        return false;
      }

      // Status Filter
      if (statusFilter !== "all" && app.status !== statusFilter) {
        return false;
      }

      // CGPA Filter
      const cgpa = Number(profile.cgpa || 7.5);
      if (cgpaFilter === "8.5" && cgpa < 8.5) return false;
      if (cgpaFilter === "8.0" && cgpa < 8.0) return false;
      if (cgpaFilter === "7.0" && cgpa < 7.0) return false;

      // Match Score Filter
      const score = Number(app.matchScore || app.matchBreakdown?.matchScore || 75);
      if (matchScoreFilter === "90" && score < 90) return false;
      if (matchScoreFilter === "80" && score < 80) return false;
      if (matchScoreFilter === "70" && score < 70) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (applicant.fullname || "").toLowerCase().includes(q);
        const emailMatch = (applicant.email || "").toLowerCase().includes(q);
        const skillMatch = (profile.skills || []).some((s) => s.toLowerCase().includes(q));
        const roleMatch = (job.title || "").toLowerCase().includes(q);
        if (!nameMatch && !emailMatch && !skillMatch && !roleMatch) return false;
      }

      return true;
    });
  }, [allApplications, selectedJobId, statusFilter, cgpaFilter, matchScoreFilter, searchQuery]);

  // KPI Metrics
  const stats = useMemo(() => {
    const total = allApplications.length;
    const shortlisted = allApplications.filter((a) => a.status === "Shortlisted").length;
    const autoApplied = allApplications.filter(
      (a) => a.applicationMethod === "Automatic" || a.status === "Applied Automatically"
    ).length;
    const interviewCount = interviews.length;

    return {
      activeJobs: recruiterJobs.length,
      totalApplicants: total,
      shortlisted,
      autoApplied,
      interviews: interviewCount,
    };
  }, [allApplications, recruiterJobs, interviews]);

  // Handle Shortlist / Reject
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await updateApplicationStatus(appId, newStatus);
      if (res.data?.success) {
        setAllApplications((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    }
  };

  // Open Interview Modal
  const openInviteModal = (applicantItem) => {
    setSelectedApplicant(applicantItem);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    setInterviewForm({
      interviewDate: tomorrow.toISOString().split("T")[0],
      interviewTime: "11:00 AM",
      interviewMode: "Online",
      meetingLinkOrLocation: "https://meet.google.com/new",
      round: "Technical",
      message: `Hi ${applicantItem.applicant?.fullname?.split(" ")[0] || "there"}, we were very impressed by your background and would love to invite you for an interview.`,
      additionalInstructions: "Please have your coding environment and resume ready.",
    });
    setInviteModalOpen(true);
  };

  // Submit Interview Invitation
  const handleSendInterview = async (e) => {
    e.preventDefault();
    if (!selectedApplicant) return;

    try {
      setSubmittingInvite(true);
      const payload = {
        applicationId: selectedApplicant._id,
        ...interviewForm,
      };

      const res = await sendInterviewInvitation(payload);
      if (res.data?.success) {
        alert("Interview invitation sent successfully!");
        setAllApplications((prev) =>
          prev.map((a) =>
            a._id === selectedApplicant._id ? { ...a, status: "Interview Requested" } : a
          )
        );
        setInviteModalOpen(false);
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send interview invitation");
    } finally {
      setSubmittingInvite(false);
    }
  };

  return (
    <div className="page-shell space-y-7">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 px-6 py-8 text-white sm:px-9 sm:py-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <FaBriefcase /> Recruiter Intelligence Workspace
            </span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-4xl text-white">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
              Manage candidate pipelines, review AI matching scores, shortlist top talent, and dispatch verified interview invitations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/post-job"
              className="inline-flex items-center gap-2 rounded-lg bg-[#145A42] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0E3D2D]"
            >
              <FaPlus className="text-[10px]" /> Post Opportunity
            </Link>
            <Link
              to="/create-company"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700"
            >
              <FaBuilding className="text-[10px]" /> Add Company
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Executive KPI Cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Active Job Roles", value: stats.activeJobs, icon: FaBriefcase, color: "text-slate-800" },
          { label: "Total Applicants", value: stats.totalApplicants, icon: FaUsers, color: "text-slate-900" },
          { label: "Shortlisted Candidates", value: stats.shortlisted, icon: FaUserCheck, color: "text-emerald-700" },
          { label: "Scheduled Interviews", value: stats.interviews, icon: FaCalendarAlt, color: "text-sky-700" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{kpi.label}</span>
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-slate-100 bg-slate-50 text-slate-600">
                  <Icon className="text-xs" />
                </span>
              </div>
              <p className={`mt-3 font-mono text-2xl sm:text-3xl font-extrabold ${kpi.color}`}>
                {loading ? "—" : kpi.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* 3. Section Tabs: Applicants & Shortlisting | Interviews | Companies */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("applicants")}
            className={`pb-3 transition-colors ${
              activeTab === "applicants"
                ? "border-b-2 border-slate-900 text-slate-900 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Candidate Shortlisting ({filteredApplicants.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("interviews")}
            className={`pb-3 transition-colors ${
              activeTab === "interviews"
                ? "border-b-2 border-slate-900 text-slate-900 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Interview Management ({interviews.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            className={`pb-3 transition-colors ${
              activeTab === "jobs"
                ? "border-b-2 border-slate-900 text-slate-900 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Active Job Openings ({recruiterJobs.length})
          </button>
        </nav>
      </div>

      {/* ========================================================
          TAB 1: CANDIDATE SHORTLISTING & AI MATCHING TABLE
          ======================================================== */}
      {activeTab === "applicants" && (
        <section className="space-y-4">
          {/* Multi-filter strip */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-3">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {/* Job Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Position</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-hidden focus:border-slate-400"
                >
                  <option value="all">All Jobs ({recruiterJobs.length})</option>
                  {recruiterJobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Application Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-hidden focus:border-slate-400"
                >
                  <option value="all">All Statuses</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Requested">Interview Requested</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Applied Automatically">Applied Automatically</option>
                  <option value="Applied Manually">Applied Manually</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Selected">Selected</option>
                </select>
              </div>

              {/* Min CGPA Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Min CGPA Filter</label>
                <select
                  value={cgpaFilter}
                  onChange={(e) => setCgpaFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-hidden focus:border-slate-400"
                >
                  <option value="all">Any CGPA</option>
                  <option value="7.0">CGPA ≥ 7.0</option>
                  <option value="8.0">CGPA ≥ 8.0</option>
                  <option value="8.5">CGPA ≥ 8.5</option>
                </select>
              </div>

              {/* Min Match % Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">AI Match Score</label>
                <select
                  value={matchScoreFilter}
                  onChange={(e) => setMatchScoreFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-hidden focus:border-slate-400"
                >
                  <option value="all">Any Match %</option>
                  <option value="70">Match ≥ 70%</option>
                  <option value="80">Match ≥ 80%</option>
                  <option value="90">Match ≥ 90% (Top Match)</option>
                </select>
              </div>

              {/* Search input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Search Candidate / Skill</label>
                <div className="relative">
                  <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. React, Rajesh..."
                    className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs outline-hidden focus:border-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Applicants Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading candidate pipelines...</div>
            ) : filteredApplicants.length === 0 ? (
              <div className="p-12 text-center">
                <FaUsers className="mx-auto text-3xl text-slate-300" />
                <h4 className="mt-3 text-sm font-bold text-slate-800">No matching candidates found</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Try clearing your filters or posting a new role to attract qualified students.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3.5 pl-5 pr-3">Candidate</th>
                      <th className="px-3 py-3.5">Position Applied</th>
                      <th className="px-3 py-3.5">AI Match Score</th>
                      <th className="px-3 py-3.5">Academics & Skills</th>
                      <th className="px-3 py-3.5">Method & Status</th>
                      <th className="py-3.5 pl-3 pr-5 text-right">Shortlist & Invite</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplicants.map((item) => {
                      const student = item.applicant || {};
                      const profile = student.profile || {};
                      const job = item.jobDetails || {};
                      const matchScore = Number(item.matchScore || item.matchBreakdown?.matchScore || 75);
                      const isShortlisted = item.status === "Shortlisted";
                      const isInvited = item.status === "Interview Requested" || item.status === "Interview Scheduled";

                      return (
                        <tr key={item._id} className="transition-colors hover:bg-slate-50/70">
                          {/* Candidate info */}
                          <td className="py-4 pl-5 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-800 text-xs font-bold text-white">
                                {student.fullname?.charAt(0) || "S"}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{student.fullname || "Anonymous Candidate"}</p>
                                <p className="text-[11px] text-slate-400">{student.email}</p>
                                <p className="text-[10px] text-slate-400">{student.phoneNumber}</p>
                              </div>
                            </div>
                          </td>

                          {/* Job applied */}
                          <td className="px-3 py-4">
                            <p className="font-semibold text-slate-800">{job.title}</p>
                            <span className="text-[11px] text-slate-400">{job.location} • {job.jobType}</span>
                          </td>

                          {/* AI Match % */}
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-bold ${
                                  matchScore >= 85
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : matchScore >= 70
                                    ? "bg-slate-100 text-slate-800 border border-slate-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {matchScore}%
                              </span>
                              <button
                                type="button"
                                onClick={() => setCandidateModal(item)}
                                className="text-[11px] font-medium text-slate-500 hover:text-slate-800 underline"
                              >
                                View Breakdown
                              </button>
                            </div>
                          </td>

                          {/* Academics & Skills */}
                          <td className="px-3 py-4">
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-slate-900">
                                <FaGraduationCap className="text-slate-400 text-xs" />
                                CGPA {profile.cgpa ? Number(profile.cgpa).toFixed(1) : "8.2"}
                              </span>
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {(profile.skills || ["React", "Node.js"]).slice(0, 3).map((s) => (
                                  <span key={s} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                                    {s}
                                  </span>
                                ))}
                                {(profile.skills || []).length > 3 && (
                                  <span className="text-[10px] text-slate-400">+{profile.skills.length - 3}</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Method & Status */}
                          <td className="px-3 py-4">
                            <div className="space-y-1.5">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  item.applicationMethod === "Automatic" || item.status === "Applied Automatically"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}
                              >
                                {item.applicationMethod === "Automatic" ? "⚡ Auto Apply" : "Manual"}
                              </span>

                              <div>
                                <span
                                  className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                    item.status === "Shortlisted"
                                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                      : item.status?.includes("Interview")
                                      ? "bg-sky-50 text-sky-800 border border-sky-200"
                                      : item.status === "Rejected"
                                      ? "bg-rose-50 text-rose-700"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {item.status || "Pending"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 pl-3 pr-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Shortlist button */}
                              {!isShortlisted && !isInvited && item.status !== "Rejected" && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(item._id, "Shortlisted")}
                                  className="inline-flex items-center gap-1 rounded-md bg-[#145A42] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs hover:bg-[#0E3D2D]"
                                  title="Shortlist this candidate"
                                >
                                  <FaCheckCircle className="text-[10px]" /> Shortlist
                                </button>
                              )}

                              {/* Send Interview button */}
                              {!isInvited && item.status !== "Rejected" && (
                                <button
                                  type="button"
                                  onClick={() => openInviteModal(item)}
                                  className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
                                  title="Send interview invitation"
                                >
                                  <FaCalendarAlt className="text-[10px]" /> Invite
                                </button>
                              )}

                              {isInvited && (
                                <span className="rounded bg-sky-50 border border-sky-200 px-2 py-1 text-[10px] font-bold text-sky-700">
                                  Invited
                                </span>
                              )}

                              {item.status !== "Rejected" && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(item._id, "Rejected")}
                                  className="rounded-md border border-slate-200 p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                  title="Reject candidate"
                                >
                                  <FaTimes className="text-xs" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          TAB 2: INTERVIEWS MANAGEMENT
          ======================================================== */}
      {activeTab === "interviews" && (
        <section className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            {interviews.length === 0 ? (
              <div className="p-12 text-center">
                <FaCalendarAlt className="mx-auto text-3xl text-slate-300" />
                <h4 className="mt-3 text-sm font-bold text-slate-800">No interview invitations sent yet</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Select candidates from the Shortlisting tab to dispatch online or offline interview requests.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3.5 pl-5 pr-3">Candidate</th>
                      <th className="px-3 py-3.5">Position</th>
                      <th className="px-3 py-3.5">Round & Mode</th>
                      <th className="px-3 py-3.5">Scheduled Date & Time</th>
                      <th className="px-3 py-3.5">Candidate Response</th>
                      <th className="py-3.5 pl-3 pr-5 text-right">Meeting Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {interviews.map((intv) => (
                      <tr key={intv._id} className="transition-colors hover:bg-slate-50/70">
                        <td className="py-4 pl-5 pr-3">
                          <p className="font-bold text-slate-900">{intv.student?.fullname || "Student"}</p>
                          <p className="text-[11px] text-slate-400">{intv.student?.email}</p>
                        </td>
                        <td className="px-3 py-4 font-semibold text-slate-800">{intv.job?.title}</td>
                        <td className="px-3 py-4">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            {intv.round} ({intv.interviewMode})
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <p className="font-semibold text-slate-900">
                            {new Date(intv.interviewDate).toLocaleDateString()}
                          </p>
                          <p className="text-[11px] text-slate-500">{intv.interviewTime}</p>
                        </td>
                        <td className="px-3 py-4">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              intv.status === "Accepted"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : intv.status === "Reschedule Requested"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : intv.status === "Declined"
                                ? "bg-rose-50 text-rose-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {intv.status}
                          </span>
                          {intv.rescheduleReason && (
                            <p className="mt-1 text-[10px] text-slate-500 italic max-w-xs">
                              Note: {intv.rescheduleReason}
                            </p>
                          )}
                        </td>
                        <td className="py-4 pl-3 pr-5 text-right">
                          {intv.meetingLinkOrLocation && intv.interviewMode === "Online" ? (
                            <a
                              href={intv.meetingLinkOrLocation.startsWith("http") ? intv.meetingLinkOrLocation : `https://${intv.meetingLinkOrLocation}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
                            >
                              <FaVideo className="text-[10px]" /> Join <FaExternalLinkAlt className="text-[9px]" />
                            </a>
                          ) : (
                            <span className="text-slate-500 text-[11px]">{intv.meetingLinkOrLocation}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          TAB 3: ACTIVE JOB OPENINGS
          ======================================================== */}
      {activeTab === "jobs" && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recruiterJobs.map((job) => {
            const applicantCount = allApplications.filter((a) => String(a.jobDetails?._id) === String(job._id)).length;
            return (
              <div key={job._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {job.jobType}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-slate-900">{job.title}</h3>
                    <p className="text-xs text-slate-500">{job.location} • ₹{job.salary}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500 font-mono">
                    <strong>{applicantCount}</strong> applicants
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJobId(String(job._id));
                      setActiveTab("applicants");
                    }}
                    className="text-xs font-bold text-[#145A42] hover:underline"
                  >
                    View Applicants →
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* ========================================================
          MODAL 1: SEND INTERVIEW INVITATION FORM
          ======================================================== */}
      {inviteModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#145A42] text-white">
                  <FaCalendarAlt className="text-xs" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Send Verified Interview Invitation</h3>
                  <p className="text-[11px] text-slate-500">
                    Inviting {selectedApplicant.applicant?.fullname} for {selectedApplicant.jobDetails?.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSendInterview} className="max-h-[75vh] overflow-y-auto p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interview Date</label>
                  <input
                    type="date"
                    value={interviewForm.interviewDate}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interview Time Slot</label>
                  <input
                    type="text"
                    value={interviewForm.interviewTime}
                    placeholder="e.g. 11:00 AM - 12:00 PM"
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewTime: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interview Round</label>
                  <select
                    value={interviewForm.round}
                    onChange={(e) => setInterviewForm({ ...interviewForm, round: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
                  >
                    <option value="Technical">Technical Round</option>
                    <option value="HR">HR & Cultural Fit</option>
                    <option value="Assessment">System Architecture / Assessment</option>
                    <option value="Final">Final Partner Round</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interview Mode</label>
                  <select
                    value={interviewForm.interviewMode}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewMode: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
                  >
                    <option value="Online">Online Video Meeting</option>
                    <option value="Offline">Offline On-Campus / Office</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Link or Location</label>
                <input
                  type="text"
                  placeholder="e.g. https://meet.google.com/xyz-abc or Room 304, Tech Park"
                  value={interviewForm.meetingLinkOrLocation}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingLinkOrLocation: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message to Candidate</label>
                <textarea
                  rows="3"
                  value={interviewForm.message}
                  onChange={(e) => setInterviewForm({ ...interviewForm, message: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Additional Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Please bring an ID card and laptop."
                  value={interviewForm.additionalInstructions}
                  onChange={(e) => setInterviewForm({ ...interviewForm, additionalInstructions: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingInvite}
                  className="rounded-lg bg-[#145A42] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#0E3D2D] disabled:opacity-50"
                >
                  {submittingInvite ? "Dispatching..." : "SEND INTERVIEW INVITATION"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: CANDIDATE MATCH BREAKDOWN VIEW
          ======================================================== */}
      {candidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  AI Matching Breakdown — {candidateModal.applicant?.fullname}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Evaluated for: {candidateModal.jobDetails?.title}
                </p>
              </div>
              <button onClick={() => setCandidateModal(null)} className="p-1 text-slate-400 hover:bg-slate-100">
                <FaTimes />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <span className="font-semibold text-slate-700">Overall Match Percentage</span>
                <span className="font-mono text-xl font-extrabold text-[#145A42]">
                  {candidateModal.matchScore || candidateModal.matchBreakdown?.matchScore || 75}%
                </span>
              </div>

              {candidateModal.matchBreakdown?.matchingSkills?.length > 0 && (
                <div>
                  <p className="font-bold text-slate-800 mb-1">Matching Verified Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {candidateModal.matchBreakdown.matchingSkills.map((s) => (
                      <span key={s} className="rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[11px]">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {candidateModal.matchBreakdown?.reasons?.length > 0 && (
                <div>
                  <p className="font-bold text-slate-800 mb-1">Key Evaluation Factors:</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    {candidateModal.matchBreakdown.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-3 text-right">
              <button
                type="button"
                onClick={() => setCandidateModal(null)}
                className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
