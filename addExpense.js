document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("expenseForm");
  const tableBody = document.getElementById("expenseTable").querySelector("tbody");

  // Fetch existing expenses on load
  fetchExpenses();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = document.getElementById("amount").value;
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;

    try {
      const response = await fetch("http://localhost:5000/api/expenses/addexpense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, title, category }),
      });

      if (!response.ok) throw new Error("Failed to add expense");

      const expense = await response.json();
      addExpenseToTable(expense);

      form.reset();
    } catch (error) {
      console.error(error);
      alert("Error adding expense");
    }
  });

  async function fetchExpenses() {
    try {
      const response = await fetch("http://localhost:5000/api/expenses/getExpenses"); // match route case
      if (!response.ok) throw new Error("Failed to fetch expenses");

      const expenses = await response.json();
      expenses.forEach(addExpenseToTable);
    } catch (error) {
      console.error(error);
    }
  }

  function addExpenseToTable(expense) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.amount}</td>
      <td>${expense.title}</td>
      <td>${expense.category}</td>
      <td>${new Date(expense.date).toLocaleDateString()}</td>
    `;
    tableBody.prepend(row);
  }
});
