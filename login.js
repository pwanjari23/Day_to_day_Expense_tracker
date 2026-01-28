const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.querySelector("input[type='email']").value.trim();
  const password = form.querySelector("input[type='password']").value.trim();

  if (!email || !password) {
    alert("Please fill in both fields");
    return;
  }

  try {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful! Welcome, " + data.user.name);
      form.reset();
      window.location.href = "/dashboard.html"; // redirect after login
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again later.");
  }
});
