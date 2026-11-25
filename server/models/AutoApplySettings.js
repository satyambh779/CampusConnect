const mongoose = require("mongoose");

const autoApplySettingsSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    enabled: {
      type: Boolean,
      default: false,
    },

    minMatchScore: {
      type: Number,
      default: 75,
      min: 50,
      max: 100,
    },

    minCgpa: {
      type: Number,
      default: 7.0,
      min: 0,
      max: 10,
    },

    preferredRoles: [
      {
        type: String,
        trim: true,
      },
    ],

    preferredCompanies: [
      {
        type: String,
        trim: true,
      },
    ],

    preferredLocations: [
      {
        type: String,
        trim: true,
      },
    ],

    jobTypes: [
      {
        type: String,
        enum: ["Full-Time", "Part-Time", "Internship", "Remote"],
      },
    ],

    minSalary: {
      type: Number,
      default: 0,
    },

    maxApplicationsPerDay: {
      type: Number,
      default: 5,
      min: 1,
      max: 50,
    },

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    applicationsCountToday: {
      type: Number,
      default: 0,
    },

    lastAppliedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AutoApplySettings", autoApplySettingsSchema);
