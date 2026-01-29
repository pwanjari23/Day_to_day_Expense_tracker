// backend/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/auth"); // Your auth middleware
const paymentController = require("../controllers/paymentController");

// Protect routes
router.use(authenticateToken);

// Create order
router.post("/create-order", paymentController.createOrder);

// Verify payment (for future use)
router.post("/verify-payment", paymentController.verifyPayment);

module.exports = router;
