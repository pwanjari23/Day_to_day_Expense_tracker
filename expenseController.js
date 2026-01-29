const Expense = require("../models/expense");

exports.addExpense = async (req, res) => {
  try {
    console.log("Request body:", req.body); // <--- Add this line
    const { amount, title, category } = req.body;

    if (!amount || !title || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      amount,
      title,
      category,
      date: new Date(),
    });

    console.log("Expense added:", expense.toJSON()); // <--- Check this
    res.status(201).json(expense);
  } catch (err) {
    console.error("Error in addExpense:", err); // <--- Check error
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExpensesById = async (req, res) => {};
exports.deleteExpensesById = async (req, res) => {};
exports.updateExpenseById = async (req, res) => {};
