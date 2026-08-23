const form = document.querySelector(".auth-form");
const errorBox = document.getElementById("form-error");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // ask our server if this email + password match a real account
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
                alert("Welcome back, " + data.name + "!");
            }
        });
});