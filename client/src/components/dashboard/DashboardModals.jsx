import React, { useState } from "react";
import {
  X,
  User,
  Settings,
  Bookmark,
  Check,
  Briefcase,
  GraduationCap,
  Upload,
  Camera,
  FileText,
} from "lucide-react";

export function ProfileModal({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  const [skills, setSkills] = useState([
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Data Structures",
    "UI/UX Design",
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700">
              <User className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Student Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto p-5 space-y-4 text-xs">
          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="h-12 w-12 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
                  {user?.fullname
                    ? user.fullname
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "RK"}
                </div>
              )}
              <label
                htmlFor="profile-photo-upload"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                title="Upload profile photo"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="sr-only"
                />
              </label>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  {user?.fullname || "Rajesh Kumar"}
                </h4>
                <label
                  htmlFor="profile-photo-upload-btn"
                  className="cursor-pointer text-[11px] font-medium text-slate-600 hover:text-slate-900 underline"
                >
                  Change Photo
                  <input
                    id="profile-photo-upload-btn"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="text-slate-500">{user?.email || "rajesh.k@campus.edu"}</p>
              <span className="mt-1 inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                Verified Student
              </span>
            </div>
          </div>

          {/* Education & Bio */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Degree & Major
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5 text-slate-800">
                <GraduationCap className="h-4 w-4 text-slate-600" />
                <span>B.Tech in Computer Science & Engineering (Class of 2026)</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Professional Bio
              </label>
              <p className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5 text-slate-700 leading-relaxed">
                Aspiring software engineer passionate about high-performance web applications, design systems, and developer tooling. Seeking 2026 internships.
              </p>
            </div>
          </div>

          {/* Skills Tag Input */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Verified Skills
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 text-slate-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a new skill (e.g. GraphQL)..."
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 outline-hidden focus:border-slate-400"
              />
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Add
              </button>
            </form>
          </div>

          {/* Resume Upload Section with File Button */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Active Resume
              </label>
              <label
                htmlFor="resume-file-upload"
                className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold text-[#145A42] hover:underline"
              >
                <Upload className="h-3 w-3" />
                Upload New File
              </label>
            </div>

            {/* Existing or uploaded file card */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200/80 p-2.5 bg-slate-50/50">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 shrink-0 text-slate-600" />
                <div className="min-w-0 truncate">
                  <p className="font-semibold text-slate-800 truncate">
                    {resumeFile ? resumeFile.name : "Rajesh_Kumar_Resume_2026.pdf"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {resumeFile
                      ? `${(resumeFile.size / 1024).toFixed(1)} KB • Just chosen`
                      : "Uploaded on 10 Nov 2026 • 240 KB"}
                  </p>
                </div>
              </div>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 shrink-0">
                {resumeFile ? "Ready to Save" : "Active"}
              </span>
            </div>

            {/* Explicit Create/Upload File Button Area */}
            <label
              htmlFor="resume-file-upload"
              className="mt-2.5 flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-slate-300 bg-white p-2.5 text-xs hover:border-slate-400 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">Attach updated resume (.pdf, .docx)</span>
              </div>
              <span className="rounded-md bg-[#145A42] hover:bg-[#0E3D2D] px-3 py-1 text-[11px] font-bold text-white shadow-xs transition-colors">
                Choose File
              </span>
              <input
                id="resume-file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#145A42] hover:bg-[#0E3D2D] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
          >
            {savedSuccess ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Saved
              </>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700">
              <Settings className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Account Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Notification Preferences</h4>
            <p className="text-[11px] text-slate-500 mb-3">
              Configure how you receive updates and pipeline changes.
            </p>

            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-slate-800">Application Status Alerts</p>
                  <p className="text-[10px] text-slate-400">Immediate email upon decision update</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 accent-slate-900"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-slate-800">Weekly Digest</p>
                  <p className="text-[10px] text-slate-400">Summary of opportunities and interview pace</p>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 accent-slate-900"
                />
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h4 className="font-semibold text-slate-900 mb-1">Recruiter Discovery</h4>
            <label className="flex items-center justify-between cursor-pointer mt-2">
              <div>
                <p className="font-medium text-slate-800">Recruiter Visibility</p>
                <p className="text-[10px] text-slate-400">Allow verified campus partners to find your profile</p>
              </div>
              <input
                type="checkbox"
                checked={profileVisible}
                onChange={(e) => setProfileVisible(e.target.checked)}
                className="h-4 w-4 rounded-sm border-slate-300 accent-slate-900"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export function SavedJobsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const savedList = [
    { id: 1, title: "Frontend Software Intern", company: "Stripe", location: "Remote", type: "Internship" },
    { id: 2, title: "Data Analyst - University Grad", company: "Linear", location: "San Francisco, CA", type: "Full-Time" },
    { id: 3, title: "Product Design Associate", company: "Figma", location: "New York, NY", type: "Internship" },
    { id: 4, title: "Infrastructure Engineering Intern", company: "Cloudflare", location: "Austin, TX", type: "Internship" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700">
              <Bookmark className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Saved Jobs ({savedList.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-slate-100">
          {savedList.map((job) => (
            <div key={job.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{job.title}</h4>
                <p className="text-[11px] text-slate-500">{job.company} • {job.location} • {job.type}</p>
              </div>
              <a
                href="/jobs"
                className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Apply
              </a>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function AutoApplySettingsModal({ isOpen, onClose, settings, onSave }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    enabled: settings?.enabled ?? false,
    minMatchScore: settings?.minMatchScore ?? 75,
    minCgpa: settings?.minCgpa ?? 7.0,
    preferredRoles: (settings?.preferredRoles || ["Software Engineer", "Full Stack Developer"]).join(", "),
    preferredCompanies: (settings?.preferredCompanies || []).join(", "),
    preferredLocations: (settings?.preferredLocations || ["Remote", "Bengaluru"]).join(", "),
    jobTypes: settings?.jobTypes || ["Full-Time", "Internship"],
    minSalary: settings?.minSalary || 0,
    maxApplicationsPerDay: settings?.maxApplicationsPerDay || 5,
    requiredSkills: (settings?.requiredSkills || ["React", "JavaScript"]).join(", "),
  });

  const [saving, setSaving] = useState(false);

  const handleCheckbox = (type) => {
    if (formData.jobTypes.includes(type)) {
      setFormData({
        ...formData,
        jobTypes: formData.jobTypes.filter((t) => t !== type),
      });
    } else {
      setFormData({
        ...formData,
        jobTypes: [...formData.jobTypes, type],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        enabled: formData.enabled,
        minMatchScore: Number(formData.minMatchScore),
        minCgpa: Number(formData.minCgpa),
        preferredRoles: formData.preferredRoles
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        preferredCompanies: formData.preferredCompanies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        preferredLocations: formData.preferredLocations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        jobTypes: formData.jobTypes,
        minSalary: Number(formData.minSalary),
        maxApplicationsPerDay: Number(formData.maxApplicationsPerDay),
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      alert("Failed to save settings: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#145A42] text-white">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Auto Apply Preferences & Engine Rules</h3>
              <p className="text-[11px] text-slate-500">Configure compatibility filters and daily application limits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto p-5 space-y-4 text-xs">
          {/* Master Enable Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 p-3.5">
            <div>
              <p className="font-bold text-slate-900">Enable Automatic Job Submissions</p>
              <p className="text-[11px] text-slate-500">
                When enabled, applications are sent automatically as soon as matching roles are published.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#145A42]"></div>
            </label>
          </div>

          {/* Min Match % Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700">Minimum AI Compatibility Score</label>
              <span className="font-mono font-bold text-[#145A42] text-sm">{formData.minMatchScore}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={formData.minMatchScore}
              onChange={(e) => setFormData({ ...formData, minMatchScore: e.target.value })}
              className="w-full accent-[#145A42] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>50% (Broad)</span>
              <span>75% (Recommended)</span>
              <span>100% (Strict)</span>
            </div>
          </div>

          {/* CGPA & Max Apps */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Minimum CGPA Filter</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.minCgpa}
                onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400 font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Applications Per Day</label>
              <input
                type="number"
                min="1"
                max="25"
                value={formData.maxApplicationsPerDay}
                onChange={(e) => setFormData({ ...formData, maxApplicationsPerDay: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400 font-mono"
                required
              />
            </div>
          </div>

          {/* Preferred Roles & Locations */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Preferred Job Roles (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Frontend Engineer, Full Stack Developer, Data Analyst"
              value={formData.preferredRoles}
              onChange={(e) => setFormData({ ...formData, preferredRoles: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Preferred Locations</label>
            <input
              type="text"
              placeholder="e.g. Remote, Bengaluru, Hyderabad, Delhi NCR"
              value={formData.preferredLocations}
              onChange={(e) => setFormData({ ...formData, preferredLocations: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
            />
          </div>

          {/* Job Types */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Accepted Employment Modes</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["Full-Time", "Internship", "Part-Time", "Remote"].map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 rounded-lg border p-2 text-xs cursor-pointer transition ${
                    formData.jobTypes.includes(type)
                      ? "border-slate-900 bg-slate-900 text-white font-semibold"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.jobTypes.includes(type)}
                    onChange={() => handleCheckbox(type)}
                    className="sr-only"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Required Mandatory Skills</label>
            <input
              type="text"
              placeholder="e.g. React, TypeScript, Python (leave blank for any)"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-hidden focus:border-slate-400"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#145A42] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0E3D2D] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Engine Rules"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
