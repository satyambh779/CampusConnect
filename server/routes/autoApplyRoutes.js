const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
  triggerScan,
  getJobMatch,
} = require("../controllers/autoApplyController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/settings", protect, requireRole("student"), getSettings);
router.put("/settings", protect, requireRole("student"), updateSettings);
router.post("/run", protect, requireRole("student"), triggerScan);
router.get("/match/:jobId", protect, getJobMatch);

module.exports = router;
