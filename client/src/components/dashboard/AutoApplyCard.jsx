import React, { useState } from "react";
import { Zap, Settings, Play, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import { runAutoApplyScan, updateAutoApplySettings } from "../../services/api";

export default function AutoApplyCard({ settings, onSettingsChange, onScanComplete }) {
  const [scanning, setScanning] = useState(false);
  const [toast, setToast] = useState(null);

  const isEnabled = Boolean(settings?.enabled);

  const handleToggle = async () => {
    try {
      const newEnabled = !isEnabled;
      const res = await updateAutoApplySettings({ enabled: newEnabled });
      if (res.data?.settings) {
        onSettingsChange(res.data.settings);
        showToast(
          newEnabled ? "Auto Apply enabled! The system is actively matching jobs." : "Auto Apply paused.",
          "success"
        );
      }
    } catch (err) {
      showToast("Failed to update Auto Apply state", "error");
    }
  };

  const handleRunScan = async () => {
    try {
      setScanning(true);
      const res = await runAutoApplyScan();
      if (res.data?.success) {
        showToast(res.data.message || `Scan completed! ${res.data.appliedCount} applications submitted.`, "success");
        if (onScanComplete) onScanComplete(res.data);
      } else {
        showToast(res.data?.message || "Scan completed. No new matching jobs found.", "info");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Error running Auto Apply scan", "error");
    } finally {
      setScanning(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-[#FFFFFF] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Toast alert */}
      {toast && (
        <div
          role="status"
          className={`absolute top-3 right-3 z-10 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold shadow-md transition-all ${
            toast.type === "success"
              ? "bg-emerald-900 text-white"
              : toast.type === "error"
              ? "bg-rose-900 text-white"
              : "bg-slate-900 text-white"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left: Engine Info & Status */}
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
              isEnabled
                ? "bg-[#145A42] text-white shadow-xs"
                : "bg-slate-100 text-slate-500 border border-slate-200"
            }`}
          >
            <Zap className={`h-5 w-5 ${isEnabled ? "fill-current animate-pulse" : ""}`} />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-bold tracking-tight text-slate-900">
                AI Auto Apply Engine
              </h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  isEnabled
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isEnabled ? "bg-emerald-600 animate-ping" : "bg-slate-400"}`} />
                {isEnabled ? "Active & Matching" : "Paused"}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500 max-w-xl leading-relaxed">
              When companies publish opportunities, the AI engine evaluates compatibility and automatically submits your application if criteria are met.
            </p>

            {/* Criteria Badges */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
              <span className="rounded bg-slate-100 px-2 py-0.5 font-medium">
                Min Match: <strong className="text-slate-900 font-mono">{settings?.minMatchScore || 70}%</strong>
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-medium">
                Min CGPA: <strong className="text-slate-900 font-mono">{settings?.minCgpa || 6.5}</strong>
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-medium">
                Daily Quota: <strong className="text-slate-900 font-mono">{settings?.applicationsCountToday || 0}/{settings?.maxApplicationsPerDay || 5}</strong>
              </span>
              {settings?.preferredRoles?.length > 0 && (
                <span className="rounded bg-slate-100 px-2 py-0.5 font-medium">
                  Role: <strong className="text-slate-900">{settings.preferredRoles[0]}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Toggle Button & Scan Trigger */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0 border-t border-slate-100 md:border-t-0">
          <button
            type="button"
            onClick={handleRunScan}
            disabled={scanning}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-60 shadow-xs"
            title="Scan all published campus opportunities now"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${scanning ? "animate-spin" : ""}`} />
            <span>{scanning ? "Scanning..." : "Scan & Apply Now"}</span>
          </button>

          <button
            type="button"
            onClick={handleToggle}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all shadow-xs ${
              isEnabled
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-[#145A42] text-white hover:bg-[#0E3D2D]"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>{isEnabled ? "PAUSE AUTO APPLY" : "ENABLE AUTO APPLY"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
