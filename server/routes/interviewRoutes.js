const express = require("express");
const router = express.Router();
const {
  createInterviewInvitation,
  getStudentInterviews,
  getRecruiterInterviews,
  respondToInterview,
  updateInterviewStatus,
} = require("../controllers/interviewController");
const { protect, requireRole } = require("../middleware/auth");

router.post("/create", protect, requireRole("recruiter"), createInterviewInvitation);
router.get("/my-interviews", protect, requireRole("student"), getStudentInterviews);
router.get("/recruiter", protect, requireRole("recruiter"), getRecruiterInterviews);
router.put("/:id/respond", protect, requireRole("student"), respondToInterview);
router.put("/:id/status", protect, requireRole("recruiter"), updateInterviewStatus);

module.exports = router;
