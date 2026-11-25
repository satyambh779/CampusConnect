import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Check,
  RotateCcw,
  X,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { respondToInterview } from "../../services/api";

export default function UpcomingInterviewsWidget({ interviews = [], onInterviewUpdated }) {
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [modalType, setModalType] = useState(null); // 'reschedule' | 'decline'
  const [reason, setReason] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAction = async (interviewId, action, extra = {}) => {
    try {
      setSubmitting(true);
      const res = await respondToInterview(interviewId, { action, ...extra });
      if (res.data?.success) {
        if (onInterviewUpdated) onInterviewUpdated();
        closeModal();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit interview response");
    } finally {
      setSubmitting(false);
    }
  };

  const openRescheduleModal = (interview) => {
    setSelectedInterview(interview);
    setModalType("reschedule");
    setReason("");
    setProposedDate("");
    setProposedTime("");
  };

  const openDeclineModal = (interview) => {
    setSelectedInterview(interview);
    setModalType("decline");
    setReason("");
  };

  const closeModal = () => {
    setSelectedInterview(null);
    setModalType(null);
    setReason("");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">Confirmed</span>;
      case "Reschedule Requested":
        return <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200">Reschedule Requested</span>;
      case "Declined":
        return <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">Declined</span>;
      case "Completed":
        return <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">Completed</span>;
      default:
        return <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">Action Required</span>;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-[#FFFFFF] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight text-slate-900">
              Upcoming Interviews & Invitations
            </h3>
            {interviews.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white font-mono">
                {interviews.length}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Review invitations, join online rooms, or request schedule adjustments.
          </p>
        </div>
      </div>

      {/* Interviews list */}
      <div className="mt-4 space-y-3">
        {interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-8 text-center bg-slate-50/50">
            <Calendar className="h-8 w-8 text-slate-300" />
            <p className="mt-2 text-xs font-semibold text-slate-700">No scheduled interviews yet</p>
            <p className="mt-0.5 text-[11px] text-slate-400 max-w-sm">
              When recruiters shortlist your applications, their interview invitations and online meeting links will appear here.
            </p>
          </div>
        ) : (
          interviews.map((item) => {
            const isPending = item.status === "Pending Response";
            const isConfirmed = item.status === "Accepted";
            const isOnline = item.interviewMode === "Online";

            return (
              <div
                key={item._id}
                className="group relative rounded-xl border border-slate-200/90 bg-white p-4 transition hover:border-slate-300 hover:shadow-xs"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: Role & Company Info */}
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-base font-bold text-slate-800">
                      {item.company?.logo ? (
                        <img src={item.company.logo} alt="" className="h-full w-full rounded-lg object-cover" />
                      ) : (
                        item.company?.name?.charAt(0) || "C"
                      )}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{item.company?.name}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                          {item.round} Round
                        </span>
                        {getStatusBadge(item.status)}
                      </div>

                      <h4 className="mt-1 text-sm font-extrabold tracking-tight text-slate-900">
                        {item.job?.title}
                      </h4>

                      {/* Date & Time pill */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(item.interviewDate).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {item.interviewTime}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          {isOnline ? <Video className="h-3.5 w-3.5 text-slate-400" /> : <MapPin className="h-3.5 w-3.5 text-slate-400" />}
                          {isOnline ? "Online Video" : item.meetingLinkOrLocation}
                        </span>
                      </div>

                      {item.message && (
                        <p className="mt-2 rounded-md bg-slate-50 p-2 text-[11px] text-slate-600 italic">
                          "{item.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAction(item._id, "accept")}
                          disabled={submitting}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#145A42] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0E3D2D]"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Accept
                        </button>

                        <button
                          type="button"
                          onClick={() => openRescheduleModal(item)}
                          disabled={submitting}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                          Reschedule
                        </button>

                        <button
                          type="button"
                          onClick={() => openDeclineModal(item)}
                          disabled={submitting}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          <X className="h-3.5 w-3.5" />
                          Decline
                        </button>
                      </>
                    )}

                    {(isConfirmed || item.status === "Rescheduled") && item.meetingLinkOrLocation && isOnline && (
                      <a
                        href={item.meetingLinkOrLocation.startsWith("http") ? item.meetingLinkOrLocation : `https://${item.meetingLinkOrLocation}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                      >
                        <Video className="h-3.5 w-3.5" />
                        Join Meeting Room
                        <ExternalLink className="h-3 w-3 text-slate-400" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reschedule Modal */}
      {modalType === "reschedule" && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Request Interview Rescheduling</h3>
            <p className="mt-1 text-xs text-slate-500">
              Propose an alternative date and time for {selectedInterview.job?.title} with {selectedInterview.company?.name}.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Proposed Alternative Date</label>
                <input
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Proposed Time Slot</label>
                <input
                  type="text"
                  placeholder="e.g. 2:00 PM - 3:00 PM"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Reason for Rescheduling</label>
                <textarea
                  placeholder="e.g. University lab exam conflict at that hour..."
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
                onClick={closeModal}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting || !reason}
                onClick={() =>
                  handleAction(selectedInterview._id, "reschedule", {
                    reason,
                    proposedDate,
                    proposedTime,
                  })
                }
                className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Submit Reschedule Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {modalType === "decline" && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Decline Interview Invitation</h3>
            <p className="mt-1 text-xs text-slate-500">
              Please share a brief note for {selectedInterview.company?.name} regarding your decision.
            </p>

            <div className="mt-4 text-xs">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Reason for Declining</label>
              <textarea
                placeholder="e.g. Accepted another offer / role location conflict..."
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
                onClick={closeModal}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting || !reason}
                onClick={() => handleAction(selectedInterview._id, "decline", { reason })}
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
