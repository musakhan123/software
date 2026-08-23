const form = document.querySelector(".auth-form");
const errorBox = document.getElementById("form-error");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.error) {
        errorBox.textContent = data.error;
        errorBox.style.display = "block";
        return;
    }

    if (data.role === "driver") {
        window.location.href = "driver-dashboard.html";
    } else {
        window.location.href = "passenger-dashboard.html";
    }
});