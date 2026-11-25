const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "Authentication is not configured" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("_id role fullname email");
    if (!user) return res.status(401).json({ success: false, message: "Account no longer exists" });
    req.user = { id: String(user._id), role: user.role, fullname: user.fullname, email: user.email };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "You do not have permission to perform this action" });
  }
  next();
};

module.exports = { protect, requireRole };
