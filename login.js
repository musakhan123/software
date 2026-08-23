const form = document.querySelector(".auth-form");
const errorBox = document.getElementById("form-error");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (data.error) {
                errorBox.textContent = data.error;
                errorBox.style.display = "block";
            } else {
                errorBox.style.display = "none";
                if (data.role === "driver") {
                    window.location.href = "driver.html";
                } else {
                    window.location.href = "passenger-dashboard.html";
                }
            }
        });
});