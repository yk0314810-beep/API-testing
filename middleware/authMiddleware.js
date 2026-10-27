const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required"
      });
    }
//use for bearer token
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select("-password");


    if (!user || decoded.ver !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Session expired. You Logged in on another device or logged out."
      });
    } 

    req.user = user;

    next();

  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;