const express = require("express");
const router = express.Router();
const { createJob, getAllJobs, getJobById, updateJob, deleteJob } = require("../controllers/jobController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/create", protect, requireRole("recruiter"), createJob);
router.put("/:id", protect, requireRole("recruiter"), updateJob);
router.delete("/:id", protect, requireRole("recruiter"), deleteJob);
module.exports = router;
