const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenseController");

// POST: Add expense
router.post("/addexpense", expenseController.addExpense);

// GET: Fetch all expenses
router.get("/getExpenses", expenseController.getExpenses);

// Other routes (not implemented yet)
router.get("/getExpenses/:id", expenseController.getExpensesById);
router.delete("/deleteExpense/:id", expenseController.deleteExpensesById);
router.put("/updateExpense/:id", expenseController.updateExpenseById);

module.exports = router;
