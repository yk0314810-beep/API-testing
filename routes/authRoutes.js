const express = require("express");

const router = express.Router();

const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/auth/login
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;