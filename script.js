// script.js
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login/index.html";
    return;
  }

  const appContainer = document.getElementById("app-container");
  appContainer.classList.remove("hidden");

  // ── Buy Premium Membership Button ─────────────────────────────
  const buyPremiumBtn = document.getElementById("buyPremiumBtn");

  if (buyPremiumBtn) {
    buyPremiumBtn.addEventListener("click", async () => {
      try {
        console.log("Starting checkout...");

        // Call backend to create order
        const res = await fetch("http://localhost:5000/api/payments/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // if your backend uses auth
          },
        });

        const data = await res.json();
        console.log("Checkout data:", data);

        if (!data.success || !data.payment_session_id) {
          alert("Failed to start payment: " + (data.message || "Unknown error"));
          return;
        }

        // Make sure Cashfree JS SDK is loaded
        if (!window.Cashfree) {
          console.error("Cashfree JS SDK not loaded!");
          alert("Payment SDK not loaded. Check console.");
          return;
        }

        // Initialize Cashfree checkout
        Cashfree.checkout({
          sessionId: data.payment_session_id,
          mode: "sandbox", // mandatory for sandbox testing
          redirectTarget: "_self", // stay in same tab
          onSuccess: function (paymentData) {
            console.log("Payment Success:", paymentData);
            alert("Payment successful! Check console for details.");
          },
          onFailure: function (err) {
            console.error("Payment Failed:", err);
            alert("Payment failed! See console for details.");
          },
        });

        console.log("Cashfree checkout called");

      } catch (err) {
        console.error("Payment initiation error:", err);
        alert("Something went wrong while starting payment. See console.");
      }
    });
  }

  // ── Modal logic (Add Expense) ─────────────────────────────
  const modal = document.getElementById("addModal");
  const modalContent = modal.querySelector("div");
  const openBtn = document.getElementById("openAddBtn");
  const closeBtn = document.getElementById("closeAddBtn");

  function openModal() {
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("opacity-100", "pointer-events-auto");
    modalContent.classList.remove("scale-95", "opacity-0");
    modalContent.classList.add("scale-100", "opacity-100");
  }

  function closeModal() {
    modal.classList.add("opacity-0", "pointer-events-none");
    modal.classList.remove("opacity-100", "pointer-events-auto");
    modalContent.classList.add("scale-95", "opacity-0");
    modalContent.classList.remove("scale-100", "opacity-100");
    document.getElementById("expenseForm").reset();
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  // ── Expense logic ─────────────────────────────
  const form = document.getElementById("expenseForm");
  const todayList = document.getElementById("todayList");
  const todayTotalEl = document.getElementById("todayTotal");
  let todayTotal = 0;

  fetchExpenses();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("amount").value);
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    if (isNaN(amount) || amount <= 0 || !title || !category) {
      alert("Please fill all fields correctly");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/expenses/addexpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, title, category }),
      });

      if (!res.ok) throw new Error(await res.text());
      const expense = await res.json();
      addExpenseToList(expense);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Could not add expense: " + (err.message || "Unknown error"));
    }
  });

  async function fetchExpenses() {
    try {
      const res = await fetch("http://localhost:5000/api/expenses/getExpenses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch expenses");
      const expenses = await res.json();

      todayList.innerHTML = "";
      todayTotal = 0;

      expenses.forEach((exp) => {
        if (isToday(exp.date)) addExpenseToList(exp);
      });

    } catch (err) {
      console.error("Fetch failed", err);
      todayList.innerHTML = `<div class="p-12 text-center text-rose-600">Failed to load expenses</div>`;
    }
  }

  function addExpenseToList(exp) {
    const item = document.createElement("div");
    item.dataset.id = exp.id;
    item.className = "expense-item p-5 sm:p-6 flex items-center gap-5 hover:bg-teal-50/70 transition relative group";

    const time = new Date(exp.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    item.innerHTML = `
      <div class="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
        ${getEmoji(exp.category)}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-medium text-lg text-teal-900 truncate">${exp.title}</div>
        <div class="text-sm text-teal-700/80">${time} • ${exp.category}</div>
      </div>
      <div class="font-bold text-rose-500 text-xl whitespace-nowrap">–₹${Number(exp.amount).toLocaleString()}</div>
    `;

    todayList.prepend(item);

    todayTotal += Number(exp.amount);
    todayTotalEl.textContent = `₹ ${todayTotal.toLocaleString()}`;
  }

  function isToday(dateStr) {
    return new Date(dateStr).toDateString() === new Date().toDateString();
  }

  function getEmoji(cat) {
    const map = {
      "Food & Drinks": "🍴",
      "Transport": "🚕",
      "Shopping": "🛍️",
      "Bills": "💡",
      "Entertainment": "🎬",
      "Health": "🩺",
      "Petrol": "⛽",
      "Salary": "💰",
      "Other": "📌",
    };
    return map[cat] || "📌";
  }

});
