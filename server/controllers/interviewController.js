const Interview = require("../models/Interview");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");

/**
 * Recruiter sends interview invitation to shortlisted candidate
 */
const createInterviewInvitation = async (req, res) => {
  try {
    const {
      applicationId,
      interviewDate,
      interviewTime,
      interviewMode,
      meetingLinkOrLocation,
      round,
      message,
      additionalInstructions,
    } = req.body;

    if (!applicationId || !interviewDate || !interviewTime || !meetingLinkOrLocation) {
      return res.status(400).json({
        success: false,
        message: "Application ID, date, time, and meeting link/location are required",
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job", "title created_by company")
      .populate("applicant", "fullname email");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (String(application.job.created_by) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to invite candidates for this role",
      });
    }

    const interview = await Interview.create({
      application: application._id,
      job: application.job._id,
      company: application.job.company,
      student: application.applicant._id,
      recruiter: req.user.id,
      interviewDate: new Date(interviewDate),
      interviewTime,
      interviewMode: interviewMode || "Online",
      meetingLinkOrLocation,
      round: round || "Technical",
      message: message || "",
      additionalInstructions: additionalInstructions || "",
      status: "Pending Response",
    });

    // Update application status
    application.status = "Interview Requested";
    application.statusHistory.push({
      status: "Interview Requested",
      changedAt: new Date(),
      updatedBy: req.user.id,
      note: `Interview invitation sent for ${round || "Technical"} Round on ${new Date(
        interviewDate
      ).toLocaleDateString()} at ${interviewTime}.`,
    });
    await application.save();

    // Create notification for student
    await Notification.create({
      recipient: application.applicant._id,
      sender: req.user.id,
      type: "interview_invite",
      title: "📅 New Interview Invitation!",
      message: `You received an invitation for a ${round || "Technical"} Interview for ${
        application.job.title
      } on ${new Date(interviewDate).toLocaleDateString()} at ${interviewTime}.`,
      link: "/interviews",
      metadata: {
        interviewId: interview._id,
        applicationId: application._id,
        jobId: application.job._id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Interview invitation sent successfully",
      interview,
    });
  } catch (error) {
    console.error("Create interview error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Student retrieves all their interview invitations
 */
const getStudentInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ student: req.user.id })
      .populate({
        path: "job",
        select: "title location salary jobType",
      })
      .populate({
        path: "company",
        select: "name logo location website description",
      })
      .populate({
        path: "recruiter",
        select: "fullname email",
      })
      .sort({ interviewDate: 1 });

    return res.json({ success: true, interviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to fetch interviews" });
  }
};

/**
 * Recruiter retrieves interviews for their jobs
 */
const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ recruiter: req.user.id })
      .populate({
        path: "student",
        select: "fullname email phoneNumber profile",
      })
      .populate({
        path: "job",
        select: "title location",
      })
      .populate({
        path: "company",
        select: "name logo",
      })
      .sort({ interviewDate: 1 });

    return res.json({ success: true, interviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to fetch recruiter interviews" });
  }
};

/**
 * Student responds to an interview invitation (Accept / Reschedule / Decline)
 */
const respondToInterview = async (req, res) => {
  try {
    const { action, reason, proposedDate, proposedTime } = req.body;
    const interview = await Interview.findOne({
      _id: req.params.id,
      student: req.user.id,
    })
      .populate("job", "title")
      .populate("company", "name")
      .populate("student", "fullname email");

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    const application = await Application.findById(interview.application);

    if (action === "accept") {
      interview.status = "Accepted";
      if (application) {
        application.status = "Interview Scheduled";
        application.statusHistory.push({
          status: "Interview Scheduled",
          changedAt: new Date(),
          updatedBy: req.user.id,
          note: "Student accepted the interview invitation.",
        });
        await application.save();
      }

      await Notification.create({
        recipient: interview.recruiter,
        sender: req.user.id,
        type: "interview_response",
        title: "✅ Interview Accepted",
        message: `${interview.student?.fullname || "Student"} accepted the interview for ${
          interview.job?.title
        }.`,
        link: "/recruiter-dashboard",
        metadata: { interviewId: interview._id, action: "accepted" },
      });
    } else if (action === "reschedule") {
      interview.status = "Reschedule Requested";
      interview.rescheduleReason = reason || "Candidate requested alternative time.";
      if (proposedDate) interview.proposedDate = new Date(proposedDate);
      if (proposedTime) interview.proposedTime = proposedTime;

      if (application) {
        application.statusHistory.push({
          status: "Reschedule Requested",
          changedAt: new Date(),
          updatedBy: req.user.id,
          note: `Student requested reschedule: ${reason || "No reason given"}`,
        });
        await application.save();
      }

      await Notification.create({
        recipient: interview.recruiter,
        sender: req.user.id,
        type: "interview_rescheduled",
        title: "🔄 Reschedule Requested",
        message: `${interview.student?.fullname || "Student"} requested to reschedule the interview for ${
          interview.job?.title
        }. Reason: ${reason || "Flexible time request"}`,
        link: "/recruiter-dashboard",
        metadata: { interviewId: interview._id, action: "reschedule", proposedDate, proposedTime },
      });
    } else if (action === "decline") {
      interview.status = "Declined";
      interview.declineReason = reason || "Candidate declined invitation.";

      if (application) {
        application.statusHistory.push({
          status: "Declined",
          changedAt: new Date(),
          updatedBy: req.user.id,
          note: `Student declined interview: ${reason || "No reason specified"}`,
        });
        await application.save();
      }

      await Notification.create({
        recipient: interview.recruiter,
        sender: req.user.id,
        type: "interview_response",
        title: "❌ Interview Declined",
        message: `${interview.student?.fullname || "Student"} declined the interview invitation for ${
          interview.job?.title
        }.`,
        link: "/recruiter-dashboard",
        metadata: { interviewId: interview._id, action: "declined" },
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    await interview.save();
    return res.json({
      success: true,
      message: `Interview status updated to ${interview.status}`,
      interview,
    });
  } catch (error) {
    console.error("Interview response error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Recruiter updates interview (e.g. confirms rescheduled time, marks Completed)
 */
const updateInterviewStatus = async (req, res) => {
  try {
    const { status, interviewDate, interviewTime, meetingLinkOrLocation } = req.body;
    const interview = await Interview.findOne({
      _id: req.params.id,
      recruiter: req.user.id,
    })
      .populate("job", "title")
      .populate("student", "fullname email");

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    if (status) interview.status = status;
    if (interviewDate) interview.interviewDate = new Date(interviewDate);
    if (interviewTime) interview.interviewTime = interviewTime;
    if (meetingLinkOrLocation) interview.meetingLinkOrLocation = meetingLinkOrLocation;

    await interview.save();

    // If rescheduled or updated, notify student
    if (status === "Rescheduled" || status === "Accepted") {
      await Notification.create({
        recipient: interview.student._id,
        sender: req.user.id,
        type: "interview_invite",
        title: "📅 Interview Schedule Confirmed",
        message: `Your interview for ${interview.job?.title} is scheduled for ${new Date(
          interview.interviewDate
        ).toLocaleDateString()} at ${interview.interviewTime}.`,
        link: "/interviews",
        metadata: { interviewId: interview._id },
      });
    }

    return res.json({ success: true, message: "Interview updated", interview });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInterviewInvitation,
  getStudentInterviews,
  getRecruiterInterviews,
  respondToInterview,
  updateInterviewStatus,
};
