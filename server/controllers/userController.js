const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const publicUser = (user) => ({
  _id: user._id, fullname: user.fullname, email: user.email,
  phoneNumber: user.phoneNumber, role: user.role, profile: user.profile,
});

// =========================
// Register User
// =========================
const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password } = req.body;
    const role = req.body.role === "recruiter" ? "recruiter" : "student";

    // Check if all fields are filled
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: publicUser(user),
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Login User
// =========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: publicUser(user),
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Logout User
// =========================
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// =========================
// Get Profile
// =========================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// Update Profile
// =========================
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const {
      fullname,
      phoneNumber,
      bio,
      skills,
      cgpa,
      degree,
      branch,
      graduationYear,
      experienceYears,
      projects,
      certifications,
      preferredRole,
      preferredLocation,
      expectedSalary,
      resume,
      resumeOriginalName,
      profilePhoto,
    } = req.body;

    if (fullname) user.fullname = fullname;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    if (!user.profile) user.profile = {};

    if (bio !== undefined) user.profile.bio = bio;
    if (skills !== undefined) user.profile.skills = skills;
    if (cgpa !== undefined) user.profile.cgpa = Number(cgpa);
    if (degree !== undefined) user.profile.degree = degree;
    if (branch !== undefined) user.profile.branch = branch;
    if (graduationYear !== undefined) user.profile.graduationYear = Number(graduationYear);
    if (experienceYears !== undefined) user.profile.experienceYears = Number(experienceYears);
    if (projects !== undefined) user.profile.projects = projects;
    if (certifications !== undefined) user.profile.certifications = certifications;
    if (preferredRole !== undefined) user.profile.preferredRole = preferredRole;
    if (preferredLocation !== undefined) user.profile.preferredLocation = preferredLocation;
    if (expectedSalary !== undefined) user.profile.expectedSalary = Number(expectedSalary);
    if (resume !== undefined) user.profile.resume = resume;
    if (resumeOriginalName !== undefined) user.profile.resumeOriginalName = resumeOriginalName;
    if (profilePhoto !== undefined) user.profile.profilePhoto = profilePhoto;

    await user.save();
    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};