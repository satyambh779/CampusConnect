const express = require("express");
const router = express.Router();
const { applyJob, getMyApplications, getApplicants, updateStatus } = require("../controllers/applicationController");
const { protect, requireRole } = require("../middleware/auth");

router.post("/apply", protect, requireRole("student"), applyJob);
router.get("/my-applications", protect, requireRole("student"), getMyApplications);
router.get("/applicants/:jobId", protect, requireRole("recruiter"), getApplicants);
router.put("/status/:id", protect, requireRole("recruiter"), updateStatus);
module.exports = router;
