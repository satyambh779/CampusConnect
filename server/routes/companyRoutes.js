const express = require("express");
const router = express.Router();
const { createCompany, getCompanies, getMyCompanies, getCompanyById, updateCompany } = require("../controllers/companyController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/", getCompanies);
router.get("/mine", protect, requireRole("recruiter"), getMyCompanies);
router.get("/:id", getCompanyById);
router.post("/create", protect, requireRole("recruiter"), createCompany);
router.put("/:id", protect, requireRole("recruiter"), updateCompany);
module.exports = router;
