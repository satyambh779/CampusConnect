const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
} = require("../controllers/userController");

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

// Logout User
router.get("/logout", logout);

module.exports = router;