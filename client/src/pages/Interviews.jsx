import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaMapPin,
  FaCheck,
  FaTimes,
  FaRedo,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaBuilding,
  FaUserTie,
} from "react-icons/fa";
import { getMyInterviews, respondToInterview } from "../services/api";

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' | 'completed'

  // Modal states
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [declineModal, setDeclineModal] = useState(null);
  const [reason, setReason] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await getMyInterviews();
      if (res.data?.success) {
        setInterviews(res.data.interviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleAction = async (interviewId, action, extra = {}) => {
    try {
      setSubmitting(true);
      const res = await respondToInterview(interviewId, { action, ...extra });
      if (res.data?.success) {
        fetchInterviews();
        setRescheduleModal(null);
        setDeclineModal(null);
        setReason("");
      }
    } catch (err) {
      alert("Failed to respond to interview: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const upcomingInterviews = useMemo(() => {
    return interviews.filter((i) => i.status !== "Completed" && i.status !== "Declined");
  }, [interviews]);

  const pastInterviews = useMemo(() => {
    return interviews.filter((i) => i.status === "Completed" || i.status === "Declined");
  }, [interviews]);

  const displayedInterviews = activeTab === "upcoming" ? upcomingInterviews : pastInterviews;

  return (
    <div className="page-shell space-y-7">
      {/* Back button */}
      <div>
        <Link to="/student-dashboard" className="button-quiet -ml-3 inline-flex items-center gap-2">
          <FaArrowLeft className="text-xs" /> Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="eyebrow inline-flex items-center gap-1.5">
              <FaCalendarAlt /> Smart Interview Management
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Your Placement Interviews & Rounds
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl">
              Track live interview requests from verified campus partners, confirm attendance, coordinate schedules, and enter video meeting rooms.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                activeTab === "upcoming"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Upcoming ({upcomingInterviews.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                activeTab === "completed"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Completed / History ({pastInterviews.length})
            </button>
          </div>
        </div>
      </section>

      {/* Interviews Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading your interview schedule...</div>
      ) : displayedInterviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <FaCalendarAlt className="mx-auto text-3xl text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-slate-800">
            {activeTab === "upcoming" ? "No upcoming interviews" : "No completed interviews yet"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            {activeTab === "upcoming"
              ? "When companies review your profile or Auto Apply matches, their direct interview invitations will appear here."
              : "Past completed and closed interview rounds will be archived in this section."}
          </p>
          <Link to="/jobs" className="button-primary mt-5 inline-flex items-center gap-2">
            Explore Opportunities
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {displayedInterviews.map((item) => {
            const isPending = item.status === "Pending Response";
            const isConfirmed = item.status === "Accepted";
            const isOnline = item.interviewMode === "Online";

            return (
              <article
                key={item._id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300 space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Company & Round */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-lg font-bold text-slate-800">
                        {item.company?.name?.charAt(0) || "C"}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{item.company?.name}</h3>
                        <p className="text-xs font-semibold text-[#145A42]">{item.job?.title}</p>
                      </div>
                    </div>

                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item.status === "Accepted"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : item.status === "Reschedule Requested"
                          ? "bg-sky-50 text-sky-800 border border-sky-200"
                          : item.status === "Declined"
                          ? "bg-rose-50 text-rose-800"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Date, Time, Mode */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-50/70 p-3 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-slate-400" />
                      <span>{new Date(item.interviewDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-slate-400" />
                      <span>{item.interviewTime}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      {isOnline ? <FaVideo className="text-slate-400" /> : <FaMapPin className="text-slate-400" />}
                      <span>
                        {item.round} Round • {isOnline ? "Online Video Meeting" : item.meetingLinkOrLocation}
                      </span>
                    </div>
                  </div>

                  {/* Recruiter Message */}
                  {item.message && (
                    <div className="mt-3 text-[11px] text-slate-600 bg-slate-50/40 border border-slate-100 rounded-lg p-2.5">
                      <span className="font-semibold text-slate-700">Recruiter Note:</span> {item.message}
                    </div>
                  )}

                  {/* Reschedule Note if present */}
                  {item.rescheduleReason && (
                    <div className="mt-2 text-[11px] text-sky-800 bg-sky-50/50 rounded-lg p-2 border border-sky-100">
                      <strong>Reschedule requested:</strong> {item.rescheduleReason}
                    </div>
                  )}
                </div>

                {/* Action Strip */}
                <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2">
                  {isPending ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleAction(item._id, "accept")}
                        disabled={submitting}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#145A42] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#0E3D2D]"
                      >
                        <FaCheck className="text-[10px]" /> Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRescheduleModal(item);
                          setReason("");
                          setProposedDate("");
                          setProposedTime("");
                        }}
                        disabled={submitting}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <FaRedo className="text-[10px] text-slate-400" /> Reschedule
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeclineModal(item);
                          setReason("");
                        }}
                        disabled={submitting}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <FaTimes className="text-[10px]" /> Decline
                      </button>
                    </div>
                  ) : isConfirmed && isOnline && item.meetingLinkOrLocation ? (
                    <a
                      href={item.meetingLinkOrLocation.startsWith("http") ? item.meetingLinkOrLocation : `https://${item.meetingLinkOrLocation}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
                    >
                      <FaVideo className="text-xs" /> Join Online Meeting <FaExternalLinkAlt className="text-[10px] text-slate-400" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">Response recorded.</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Request Reschedule</h3>
            <p className="mt-1 text-xs text-slate-500">
              Propose an alternative slot for {rescheduleModal.job?.title} at {rescheduleModal.company?.name}.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Proposed Alternative Date</label>
                <input
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Proposed Time Slot</label>
                <input
                  type="text"
                  placeholder="e.g. 3:00 PM - 4:00 PM"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Reason for Rescheduling</label>
                <textarea
                  placeholder="e.g. Prior academic test conflict..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
                  required
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setRescheduleModal(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting || !reason}
                onClick={() =>
                  handleAction(rescheduleModal._id, "reschedule", {
                    reason,
                    proposedDate,
                    proposedTime,
                  })
                }
                className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Submit Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {declineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Decline Interview</h3>
            <p className="mt-1 text-xs text-slate-500">
              Provide a reason for declining the invitation from {declineModal.company?.name}.
            </p>

            <div className="mt-4 text-xs">
              <label className="block font-semibold text-slate-600 mb-1">Reason for Declining</label>
              <textarea
                placeholder="e.g. Accepted another position..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="3"
                className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
                required
              />
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setDeclineModal(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting || !reason}
                onClick={() => handleAction(declineModal._id, "decline", { reason })}
                className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {submitting ? "Declining..." : "Decline Invitation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
