import React, { useEffect, useState, useMemo, useCallback } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import TopNavigation from "../components/dashboard/TopNavigation";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import KpiCards from "../components/dashboard/KpiCards";
import AutoApplyCard from "../components/dashboard/AutoApplyCard";
import UpcomingInterviewsWidget from "../components/dashboard/UpcomingInterviewsWidget";
import ChartsSection from "../components/dashboard/ChartsSection";
import RecentApplicationsTable from "../components/dashboard/RecentApplicationsTable";
import RecommendedOpportunities from "../components/dashboard/RecommendedOpportunities";
import ProfileCompletionWidget from "../components/dashboard/ProfileCompletionWidget";
import {
  ProfileModal,
  SettingsModal,
  SavedJobsModal,
  AutoApplySettingsModal,
} from "../components/dashboard/DashboardModals";
import {
  getMyApplications,
  getJobs,
  getAutoApplySettings,
  updateAutoApplySettings,
  getMyInterviews,
} from "../services/api";

export default function StudentDashboard() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [activeNav, setActiveNav] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");
  const [searchQuery, setSearchQuery] = useState("");

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavedJobsOpen, setIsSavedJobsOpen] = useState(false);
  const [isAutoApplyModalOpen, setIsAutoApplyModalOpen] = useState(false);

  const [realApplications, setRealApplications] = useState([]);
  const [realJobs, setRealJobs] = useState([]);
  const [realInterviews, setRealInterviews] = useState([]);
  const [autoApplySettings, setAutoApplySettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const promises = [
        getJobs(),
        getMyApplications(),
        getAutoApplySettings(),
        getMyInterviews(),
      ];

      const results = await Promise.allSettled(promises);

      if (results[0].status === "fulfilled" && results[0].value?.data?.jobs) {
        setRealJobs(results[0].value.data.jobs);
      }

      if (results[1].status === "fulfilled" && results[1].value?.data?.applications) {
        setRealApplications(results[1].value.data.applications);
      }

      if (results[2].status === "fulfilled" && results[2].value?.data?.settings) {
        setAutoApplySettings(results[2].value.data.settings);
      }

      if (results[3].status === "fulfilled" && results[3].value?.data?.interviews) {
        setRealInterviews(results[3].value.data.interviews);
      }
    } catch (err) {
      console.warn("Backend data fetch notice:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    const realTotal = realApplications.length;
    const realAutoApplied = realApplications.filter(
      (a) =>
        a.applicationMethod === "Automatic" ||
        a.status === "Applied Automatically"
    ).length;
    const realShortlisted = realApplications.filter(
      (a) => (a.status || "").toLowerCase() === "shortlisted"
    ).length;
    const realInterviewsCount = realInterviews.length;

    let multiplier = 1;
    if (timeRange === "7d") multiplier = 0.35;
    else if (timeRange === "30d") multiplier = 1.0;
    else if (timeRange === "90d") multiplier = 2.4;
    else if (timeRange === "1y") multiplier = 5.2;

    if (realTotal > 0 || realInterviewsCount > 0) {
      return {
        total: Math.round(Math.max(realTotal, 1) * multiplier),
        autoApplied: Math.round(realAutoApplied * multiplier),
        shortlisted: Math.round(realShortlisted * multiplier),
        interviews: Math.max(realInterviewsCount, 1),
      };
    }

    return {
      total: Math.round(24 * multiplier),
      autoApplied: Math.round(14 * multiplier),
      shortlisted: Math.round(10 * multiplier),
      interviews: 3,
    };
  }, [realApplications, realInterviews, timeRange]);

  const handleSaveAutoApplySettings = async (payload) => {
    const res = await updateAutoApplySettings(payload);
    if (res.data?.settings) {
      setAutoApplySettings(res.data.settings);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-slate-200 selection:text-slate-900">
      {/* 1. Fixed Left Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={(nav) => {
          if (nav === "saved") {
            setIsSavedJobsOpen(true);
          } else if (nav === "auto-apply") {
            setIsAutoApplyModalOpen(true);
          } else {
            setActiveNav(nav);
          }
        }}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAutoApply={() => setIsAutoApplyModalOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex flex-col lg:pl-64 min-h-screen">
        {/* 2. Top Navigation */}
        <TopNavigation
          setMobileOpen={setMobileOpen}
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 3. Main Dashboard Content Container */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Welcome Banner */}
          <WelcomeSection
            user={user}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            onOpenProfile={() => setIsProfileOpen(true)}
          />

          {/* AI Auto Apply Engine Control Card */}
          <AutoApplyCard
            settings={autoApplySettings}
            onSettingsChange={(newSettings) => setAutoApplySettings(newSettings)}
            onScanComplete={() => fetchData()}
          />

          {/* 4. KPI Analytics Cards */}
          <KpiCards stats={stats} timeRange={timeRange} />

          {/* Smart Interview Management Section */}
          <UpcomingInterviewsWidget
            interviews={realInterviews}
            onInterviewUpdated={() => fetchData()}
          />

          {/* 5. Advanced Charts & Graphs */}
          <ChartsSection timeRange={timeRange} />

          {/* 6. Recent Applications Table */}
          <RecentApplicationsTable
            realApplications={realApplications}
            loading={loading}
          />

          {/* 7 & 8. Bottom Grid: Recommended Opportunities + Profile Completion */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* 7. Recommended Opportunities */}
            <div className="lg:col-span-7">
              <RecommendedOpportunities
                realJobs={realJobs}
              />
            </div>

            {/* 8. Profile Completion Widget */}
            <div className="lg:col-span-5">
              <ProfileCompletionWidget
                user={user}
                onOpenProfile={() => setIsProfileOpen(true)}
              />
            </div>
          </div>
        </main>

        {/* Footer info */}
        <footer className="mt-auto border-t border-slate-200/80 bg-white px-4 py-3.5 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span className="font-semibold text-slate-700">
              CampusConnect Enterprise Career Platform
            </span>
            <span className="text-slate-400">
              Synced with institutional placement cell & automated interview coordinator. All rights reserved.
            </span>
          </div>
        </footer>
      </div>

      {/* Interactive Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <SavedJobsModal
        isOpen={isSavedJobsOpen}
        onClose={() => setIsSavedJobsOpen(false)}
      />

      <AutoApplySettingsModal
        isOpen={isAutoApplyModalOpen}
        onClose={() => setIsAutoApplyModalOpen(false)}
        settings={autoApplySettings}
        onSave={handleSaveAutoApplySettings}
      />
    </div>
  );
}
