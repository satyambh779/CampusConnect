const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const AutoApplySettings = require("../models/AutoApplySettings");
const Notification = require("../models/Notification");
const { calculateJobMatch } = require("../utils/jobMatcher");

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  const a = new Date(d1);
  const b = new Date(d2);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Executes Auto Apply routine across all opted-in students for a newly published job.
 */
async function runAutoApplyForJob(jobId) {
  try {
    const job = await Job.findById(jobId).populate("company", "name location");
    if (!job) return { success: false, appliedCount: 0 };

    const activeSettings = await AutoApplySettings.find({ enabled: true }).populate("student");
    let appliedCount = 0;

    for (const settings of activeSettings) {
      const student = settings.student;
      if (!student || student.role !== "student") continue;

      // Reset daily application limit if on a new calendar day
      const today = new Date();
      if (!isSameDay(settings.lastAppliedDate, today)) {
        settings.applicationsCountToday = 0;
        settings.lastAppliedDate = today;
      }

      if (settings.applicationsCountToday >= settings.maxApplicationsPerDay) {
        continue;
      }

      // Check student CGPA criteria
      const studentCgpa = Number(student.profile?.cgpa || 7.5);
      if (studentCgpa < settings.minCgpa) continue;

      // Check Salary criteria
      if (settings.minSalary > 0 && job.salary < settings.minSalary) continue;

      // Check Job Type criteria
      if (
        Array.isArray(settings.jobTypes) &&
        settings.jobTypes.length > 0 &&
        !settings.jobTypes.includes(job.jobType)
      ) {
        continue;
      }

      // Check if already applied
      const existing = await Application.findOne({ job: job._id, applicant: student._id });
      if (existing) continue;

      // Run AI Matching
      const match = calculateJobMatch(student, job);
      if (match.matchScore < settings.minMatchScore) continue;

      // Check required skills if configured
      if (Array.isArray(settings.requiredSkills) && settings.requiredSkills.length > 0) {
        const studentSkills = (student.profile?.skills || []).map((s) => s.toLowerCase());
        const hasAllRequired = settings.requiredSkills.every((req) =>
          studentSkills.some((s) => s.includes(req.toLowerCase()))
        );
        if (!hasAllRequired) continue;
      }

      // Create Auto Application
      const application = await Application.create({
        job: job._id,
        applicant: student._id,
        status: "Applied Automatically",
        applicationMethod: "Automatic",
        matchScore: match.matchScore,
        matchBreakdown: match,
        statusHistory: [
          {
            status: "Applied Automatically",
            changedAt: new Date(),
            note: `Auto-applied based on a ${match.matchScore}% AI match score and student preferences.`,
          },
        ],
      });

      // Update Job
      await Job.updateOne({ _id: job._id }, { $addToSet: { applications: application._id } });

      // Increment count
      settings.applicationsCountToday += 1;
      settings.lastAppliedDate = today;
      await settings.save();

      // Send Notification to student
      await Notification.create({
        recipient: student._id,
        type: "auto_apply",
        title: "Auto Apply Submitted",
        message: `Auto Apply submitted your application for ${job.title} at ${job.company?.name || "a campus partner"} with a ${match.matchScore}% compatibility score.`,
        link: "/my-applications",
        metadata: {
          jobId: job._id,
          applicationId: application._id,
          matchScore: match.matchScore,
        },
      });

      appliedCount++;
    }

    return { success: true, appliedCount };
  } catch (err) {
    console.error("Auto Apply for job error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Runs Auto Apply scan for a specific student across all existing published jobs.
 */
async function runAutoApplyForStudent(studentId) {
  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      throw new Error("Student account not found");
    }

    let settings = await AutoApplySettings.findOne({ student: studentId });
    if (!settings) {
      settings = await AutoApplySettings.create({
        student: studentId,
        enabled: true,
        minMatchScore: 70,
        minCgpa: 6.5,
      });
    }

    const today = new Date();
    if (!isSameDay(settings.lastAppliedDate, today)) {
      settings.applicationsCountToday = 0;
      settings.lastAppliedDate = today;
    }

    const remainingQuota = Math.max(0, settings.maxApplicationsPerDay - settings.applicationsCountToday);
    if (remainingQuota <= 0) {
      return {
        success: true,
        appliedCount: 0,
        message: `Daily Auto Apply limit (${settings.maxApplicationsPerDay}) reached for today. Resets tomorrow.`,
      };
    }

    const jobs = await Job.find({}).populate("company", "name location logo");
    const appliedJobs = [];

    for (const job of jobs) {
      if (appliedJobs.length >= remainingQuota) break;

      // Don't apply to own jobs (if recruiter posted)
      if (String(job.created_by) === String(studentId)) continue;

      // Check existing application
      const existing = await Application.findOne({ job: job._id, applicant: studentId });
      if (existing) continue;

      // Check student CGPA criteria
      const studentCgpa = Number(student.profile?.cgpa || 7.5);
      if (studentCgpa < settings.minCgpa) continue;

      // Check Salary criteria
      if (settings.minSalary > 0 && job.salary < settings.minSalary) continue;

      // Check Job Type criteria
      if (
        Array.isArray(settings.jobTypes) &&
        settings.jobTypes.length > 0 &&
        !settings.jobTypes.includes(job.jobType)
      ) {
        continue;
      }

      // Calculate AI match score
      const match = calculateJobMatch(student, job);
      if (match.matchScore < settings.minMatchScore) continue;

      // Submit application
      const application = await Application.create({
        job: job._id,
        applicant: studentId,
        status: "Applied Automatically",
        applicationMethod: "Automatic",
        matchScore: match.matchScore,
        matchBreakdown: match,
        statusHistory: [
          {
            status: "Applied Automatically",
            changedAt: new Date(),
            note: `Auto-applied during student batch scan with a ${match.matchScore}% compatibility score.`,
          },
        ],
      });

      await Job.updateOne({ _id: job._id }, { $addToSet: { applications: application._id } });

      await Notification.create({
        recipient: studentId,
        type: "auto_apply",
        title: "Auto Apply Submitted",
        message: `Auto Apply matched and submitted your application for ${job.title} at ${job.company?.name || "Campus partner"} (${match.matchScore}% match).`,
        link: "/my-applications",
        metadata: {
          jobId: job._id,
          applicationId: application._id,
          matchScore: match.matchScore,
        },
      });

      appliedJobs.push({
        jobId: job._id,
        title: job.title,
        company: job.company?.name,
        matchScore: match.matchScore,
      });
    }

    settings.applicationsCountToday += appliedJobs.length;
    settings.lastAppliedDate = today;
    await settings.save();

    return {
      success: true,
      appliedCount: appliedJobs.length,
      appliedJobs,
      message:
        appliedJobs.length > 0
          ? `Auto Apply submitted ${appliedJobs.length} eligible applications based on your profile criteria!`
          : "No new unapplied opportunities met your minimum match score criteria. Try lowering the threshold or updating skills.",
    };
  } catch (err) {
    console.error("Student auto apply error:", err);
    return { success: false, error: err.message };
  }
}

module.exports = {
  runAutoApplyForJob,
  runAutoApplyForStudent,
};
