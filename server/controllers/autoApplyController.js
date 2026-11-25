const AutoApplySettings = require("../models/AutoApplySettings");
const Job = require("../models/Job");
const User = require("../models/User");
const { runAutoApplyForStudent } = require("../services/autoApplyService");
const { calculateJobMatch } = require("../utils/jobMatcher");

const getSettings = async (req, res) => {
  try {
    let settings = await AutoApplySettings.findOne({ student: req.user.id });
    if (!settings) {
      settings = await AutoApplySettings.create({
        student: req.user.id,
        enabled: false,
        minMatchScore: 70,
        minCgpa: 6.5,
        maxApplicationsPerDay: 5,
        jobTypes: ["Full-Time", "Internship"],
      });
    }
    return res.json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to fetch auto apply settings" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const allowed = [
      "enabled",
      "minMatchScore",
      "minCgpa",
      "preferredRoles",
      "preferredCompanies",
      "preferredLocations",
      "jobTypes",
      "minSalary",
      "maxApplicationsPerDay",
      "requiredSkills",
    ];

    let settings = await AutoApplySettings.findOne({ student: req.user.id });
    if (!settings) {
      settings = new AutoApplySettings({ student: req.user.id });
    }

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        settings[key] = req.body[key];
      }
    }

    await settings.save();
    return res.json({ success: true, message: "Auto Apply settings updated", settings });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const triggerScan = async (req, res) => {
  try {
    const result = await runAutoApplyForStudent(req.user.id);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getJobMatch = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const student = await User.findById(req.user.id);
    const match = calculateJobMatch(student, job);

    return res.json({ success: true, match });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error calculating match score" });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  triggerScan,
  getJobMatch,
};
