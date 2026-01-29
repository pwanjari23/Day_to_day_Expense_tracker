const express = require("express");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../Frontend/public")));

// API routes (must come before catch-all)
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);

app.get('/', (req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.sendFile(path.join(__dirname, '../Frontend/public/dashboard.html'));
});

module.exports = app;