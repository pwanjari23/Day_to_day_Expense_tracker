// backend/controllers/paymentController.js
const axios = require("axios");

const APP_ID = "TEST430329ae80e0f32e41a393d78b923034";
const SECRET_KEY = "TESTaf195616268bd6202eeb3bf8dc458956e7192a85";
const SANDBOX_API = "https://sandbox.cashfree.com/pg/orders";

exports.createOrder = async (req, res) => {
  try {
    const user = {
      id: "TEST_USER",
      name: "Test User",
      email: "test@example.com",
      phone: "9876543210",
    };

    const orderId = `ORDER_TEST_${Date.now()}`;

    const requestBody = {
      order_id: orderId,
      order_amount: "1", // ₹1
      order_currency: "INR",
      order_note: "Premium Test",
      customer_details: {
        customer_id: user.id,
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone,
      },
      return_url: "https://www.example.com/return", // any dummy URL
    };

    // Call Cashfree REST API
    const response = await axios.post(SANDBOX_API, requestBody, {
      headers: {
        "x-api-version": "2025-01-01",
        "x-client-id": APP_ID,
        "x-client-secret": SECRET_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("Cashfree REST response:", response.data);

    if (!response.data.payment_session_id) {
      return res.status(500).json({
        success: false,
        message: "No payment session returned",
        response: response.data,
      });
    }

    res.json({
      success: true,
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
    });

  } catch (err) {
    console.error("Create order error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: err.response?.data || err.message,
    });
  }
};


// Verify payment (optional)
exports.verifyPayment = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Payment verification not implemented yet",
  });
};
