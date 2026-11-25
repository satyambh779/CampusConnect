const mongoose = require("mongoose");
const Job = require("../models/Job");
const Company = require("../models/Company");
const { runAutoApplyForJob } = require("../services/autoApplyService");

const publicJobFields = [
  "title",
  "description",
  "requirements",
  "requiredSkills",
  "requiredCgpa",
  "preferredBranch",
  "salary",
  "location",
  "experienceLevel",
  "jobType",
  "position",
  "company",
];

const createJob = async (req, res) => {
  try {
    const payload = {};
    for (const key of publicJobFields) payload[key] = req.body[key];
    const company = await Company.findOne({ _id: payload.company, userId: req.user.id });
    if (!company) return res.status(403).json({ success: false, message: "Choose a company you own" });
    if (payload.experienceLevel === "Fresher") payload.experienceLevel = 0;
    if (payload.experienceLevel !== undefined) payload.experienceLevel = Number(payload.experienceLevel);
    if (payload.salary !== undefined) payload.salary = Number(payload.salary);
    if (payload.position !== undefined) payload.position = Number(payload.position);
    if (payload.requiredCgpa !== undefined) payload.requiredCgpa = Number(payload.requiredCgpa);
    const job = await Job.create({ ...payload, created_by: req.user.id });

    // Trigger AI Auto-Apply asynchronously for eligible students
    runAutoApplyForJob(job._id).catch((err) =>
      console.error("Auto apply background error:", err)
    );

    return res.status(201).json({ success: true, message: "Job Created Successfully", job });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getAllJobs = async (_req, res) => {
  try {
    const jobs = await Job.find().populate("company", "name description website location logo").populate("created_by", "fullname");
    return res.json({ success: true, jobs });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to fetch jobs" }); }
};

const getJobById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid job ID" });
    const job = await Job.findById(req.params.id).populate("company", "name description website location logo").populate("created_by", "fullname");
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    return res.json({ success: true, job });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to fetch job" }); }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, created_by: req.user.id });
    if (!job) return res.status(404).json({ success: false, message: "Job not found or you do not own it" });
    const allowed = ["title", "description", "requirements", "salary", "location", "experienceLevel", "jobType", "position", "company"];
    for (const key of allowed) if (req.body[key] !== undefined) job[key] = req.body[key];
    if (req.body.company) {
      const company = await Company.findOne({ _id: req.body.company, userId: req.user.id });
      if (!company) return res.status(403).json({ success: false, message: "Choose a company you own" });
    }
    if (req.body.experienceLevel === "Fresher") job.experienceLevel = 0;
    await job.save();
    return res.json({ success: true, message: "Job Updated Successfully", job });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, created_by: req.user.id });
    if (!job) return res.status(404).json({ success: false, message: "Job not found or you do not own it" });
    const Application = require("../models/Application");
    await Application.deleteMany({ job: job._id });
    return res.json({ success: true, message: "Job Deleted Successfully" });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to delete job" }); }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };
