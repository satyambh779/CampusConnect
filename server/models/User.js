const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student",
    },

    profile: {
      bio: {
        type: String,
        default: "",
      },

      skills: [
        {
          type: String,
        },
      ],

      cgpa: {
        type: Number,
        default: 8.2,
      },

      degree: {
        type: String,
        default: "B.Tech",
      },

      branch: {
        type: String,
        default: "Computer Science & Engineering",
      },

      graduationYear: {
        type: Number,
        default: 2026,
      },

      experienceYears: {
        type: Number,
        default: 0,
      },

      projects: [
        {
          title: String,
          description: String,
          technologies: [String],
        },
      ],

      certifications: [
        {
          type: String,
        },
      ],

      preferredRole: {
        type: String,
        default: "Software Engineer",
      },

      preferredLocation: {
        type: String,
        default: "Bengaluru / Remote",
      },

      expectedSalary: {
        type: Number,
        default: 600000,
      },

      resume: {
        type: String,
        default: "",
      },

      resumeOriginalName: {
        type: String,
        default: "",
      },

      profilePhoto: {
        type: String,
        default: "",
      },

      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
