const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
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
      ],
      default: "Applied Manually",
    },

    applicationMethod: {
      type: String,
      enum: ["Automatic", "Manual"],
      default: "Manual",
    },

    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    matchBreakdown: {
      matchingSkills: [String],
      missingSkills: [String],
      eligibilityStatus: { type: String, default: "Eligible" },
      reasons: [String],
    },

    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
