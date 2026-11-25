const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { calculateJobMatch } = require("../utils/jobMatcher");

const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId).populate("company", "name");
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (String(job.created_by) === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot apply to your own job" });
    }

    const student = await User.findById(req.user.id);
    const match = calculateJobMatch(student, job);

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      status: "Applied Manually",
      applicationMethod: "Manual",
      matchScore: match.matchScore,
      matchBreakdown: match,
      statusHistory: [
        {
          status: "Applied Manually",
          changedAt: new Date(),
          updatedBy: req.user.id,
          note: `Applied manually with a ${match.matchScore}% AI match score.`,
        },
      ],
    });

    await Job.updateOne({ _id: job._id }, { $addToSet: { applications: application._id } });

    // Notify recruiter of new applicant
    await Notification.create({
      recipient: job.created_by,
      sender: req.user.id,
      type: "general",
      title: "New Application Received",
      message: `${student?.fullname || "A student"} applied for ${job.title} (${match.matchScore}% match).`,
      link: `/recruiter-dashboard`,
      metadata: { jobId: job._id, applicationId: application._id },
    });

    return res.status(201).json({
      success: true,
      message: "Application Submitted Successfully",
      application,
      match,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "You have already applied for this job" });
    }
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Unable to submit application" });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: "job",
        select:
          "title jobType location salary experienceLevel position requiredSkills requiredCgpa createdAt company",
        populate: { path: "company", select: "name logo location website description" },
      })
      .sort({ createdAt: -1 });

    return res.json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to fetch your applications" });
  }
};

const getApplicants = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, created_by: req.user.id }).select(
      "_id title company"
    );
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or you do not own it" });
    }

    const applications = await Application.find({ job: job._id })
      .populate({
        path: "applicant",
        select:
          "fullname email phoneNumber profile",
      })
      .sort({ createdAt: -1 });

    return res.json({ success: true, applications, applicants: applications });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Unable to fetch applicants" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job", "title created_by company")
      .populate("applicant", "fullname email");

    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    if (String(application.job.created_by) !== req.user.id) {
      return res.status(403).json({ success: false, message: "You cannot update this application" });
    }

    const { status, note } = req.body;
    const validStatuses = [
      "Applied Automatically",
      "Applied Manually",
      "Pending",
      "Under Review",
      "Shortlisted",
      "Interview Requested",
      "Interview Scheduled",
      "Rejected",
      "Selected",
      "Withdrawn",
      "Accepted",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid application status" });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      updatedBy: req.user.id,
      note: note || `Status updated to ${status} by recruiter.`,
    });

    await application.save();

    // Notify the student
    let notifTitle = `Application Status Update`;
    let notifMsg = `Your application for ${application.job.title} is now ${status}.`;
    let notifType = "general";

    if (status === "Shortlisted") {
      notifTitle = "🎉 You have been Shortlisted!";
      notifMsg = `Congratulations! You have been shortlisted for the ${application.job.title} role.`;
      notifType = "shortlisted";
    } else if (status === "Rejected") {
      notifTitle = "Application Status Update";
      notifMsg = `Your application for ${application.job.title} was not selected to proceed.`;
      notifType = "rejected";
    } else if (status === "Selected" || status === "Accepted") {
      notifTitle = "🌟 Offer Extended / Selected!";
      notifMsg = `Great news! You have been selected for ${application.job.title}.`;
      notifType = "selected";
    }

    await Notification.create({
      recipient: application.applicant._id,
      sender: req.user.id,
      type: notifType,
      title: notifTitle,
      message: notifMsg,
      link: "/my-applications",
      metadata: { applicationId: application._id, jobId: application.job._id, status },
    });

    return res.json({ success: true, message: `Application status updated to ${status}`, application });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Unable to update application status" });
  }
};

module.exports = { applyJob, getMyApplications, getApplicants, updateStatus };
