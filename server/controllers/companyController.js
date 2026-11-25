const mongoose = require("mongoose");
const Company = require("../models/Company");
const Job = require("../models/Job");

const createCompany = async (req, res) => {
  try {
    const { name, description = "", website = "", location = "", logo = "" } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: "Company name is required" });
    const existing = await Company.findOne({ name: name.trim(), userId: req.user.id });
    if (existing) return res.status(409).json({ success: false, message: "Company already exists" });
    const company = await Company.create({ name: name.trim(), description, website, location, logo, userId: req.user.id });
    return res.status(201).json({ success: true, message: "Company Created Successfully", company });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select("name description website location logo userId createdAt");
    return res.json({ success: true, companies });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to fetch companies" }); }
};

const getMyCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.user.id }).select("name description website location logo userId createdAt");
    return res.json({ success: true, companies });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to fetch your companies" }); }
};

const getCompanyById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid company ID" });
    const company = await Company.findById(req.params.id).select("name description website location logo userId createdAt");
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    return res.json({ success: true, company });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to fetch company" }); }
};

const updateCompany = async (req, res) => {
  try {
    const allowed = ["name", "description", "website", "location", "logo"];
    const updates = {};
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
    const company = await Company.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, updates, { new: true, runValidators: true }).select("name description website location logo userId createdAt");
    if (!company) return res.status(404).json({ success: false, message: "Company not found or you do not own it" });
    return res.json({ success: true, message: "Company Updated Successfully", company });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

module.exports = { createCompany, getCompanies, getMyCompanies, getCompanyById, updateCompany };
