const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interviewDate: {
      type: Date,
      required: true,
    },

    interviewTime: {
      type: String,
      required: true,
    },

    interviewMode: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Online",
    },

    meetingLinkOrLocation: {
      type: String,
      required: true,
    },

    round: {
      type: String,
      enum: ["Technical", "HR", "Assessment", "Final"],
      default: "Technical",
    },

    message: {
      type: String,
      default: "",
    },

    additionalInstructions: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending Response",
        "Accepted",
        "Reschedule Requested",
        "Rescheduled",
        "Declined",
        "Completed",
      ],
      default: "Pending Response",
    },

    rescheduleReason: {
      type: String,
      default: "",
    },

    proposedDate: {
      type: Date,
    },

    proposedTime: {
      type: String,
    },

    declineReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);
