import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ==========================
// User APIs
// ==========================
export const registerUser = (data) =>
  API.post("/users/register", data);

export const loginUser = (data) =>
  API.post("/users/login", data);

export const logoutUser = () =>
  API.post("/users/logout");

export const getUserProfile = () =>
  API.get("/users/profile");

export const updateUserProfile = (data) =>
  API.put("/users/profile", data);

// ==========================
// Company APIs
// ==========================
export const createCompany = (data) =>
  API.post("/companies/create", data);

export const getCompanies = (userId) => {
  if (userId) return API.get("/companies/mine");
  return API.get("/companies");
};
export const getCompany = (id) =>
  API.get(`/companies/${id}`);

export const updateCompany = (id, data) =>
  API.put(`/companies/${id}`, data);

// ==========================
// Job APIs
// ==========================
export const createJob = (data) =>
  API.post("/jobs/create", data);

export const getJobs = () =>
  API.get("/jobs");

export const getJob = (id) =>
  API.get(`/jobs/${id}`);

export const updateJob = (id, data) =>
  API.put(`/jobs/${id}`, data);

export const deleteJob = (id) =>
  API.delete(`/jobs/${id}`);

// ==========================
// Application APIs
// ==========================
export const applyJob = (data) =>
  API.post("/applications/apply", data);

export const getMyApplications = (_userId) =>
  API.get("/applications/my-applications");

export const getApplicants = (jobId) =>
  API.get(`/applications/applicants/${jobId}`);

export const updateApplicationStatus = (id, status, note) =>
  API.put(`/applications/status/${id}`, { status, note });

// ==========================
// Auto Apply APIs
// ==========================
export const getAutoApplySettings = () =>
  API.get("/auto-apply/settings");

export const updateAutoApplySettings = (data) =>
  API.put("/auto-apply/settings", data);

export const runAutoApplyScan = () =>
  API.post("/auto-apply/run");

export const getJobMatchScore = (jobId) =>
  API.get(`/auto-apply/match/${jobId}`);

// ==========================
// Interview APIs
// ==========================
export const sendInterviewInvitation = (data) =>
  API.post("/interviews/create", data);

export const getMyInterviews = () =>
  API.get("/interviews/my-interviews");

export const getRecruiterInterviews = () =>
  API.get("/interviews/recruiter");

export const respondToInterview = (id, data) =>
  API.put(`/interviews/${id}/respond`, data);

export const updateInterviewStatus = (id, data) =>
  API.put(`/interviews/${id}/status`, data);

// ==========================
// Notification APIs
// ==========================
export const getNotifications = () =>
  API.get("/notifications");

export const markNotificationRead = (id) =>
  API.put(`/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  API.put("/notifications/read-all");

export default API;
