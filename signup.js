const roleOptions = document.querySelectorAll(".role-option");
let selectedRole = null;

roleOptions.forEach(function (option) {
    option.addEventListener("click", function () {
        roleOptions.forEach(function (o) {
            o.classList.remove("selected");
        });
        option.classList.add("selected");
        selectedRole = option.dataset.role;
    });
});

const form = document.querySelector(".auth-form");
const errorBox = document.getElementById("form-error");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        showError("Please fill in all fields.");
        return;
    }
    if (password.length < 6) {
        showError("Password must be at least 6 characters.");
        return;
    }
    if (!selectedRole) {
        showError("Please select whether you're a passenger or driver.");
        return;
    }

    const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role: selectedRole })
    });
    const data = await res.json();

    if (data.error) {
        showError(data.error);
    } else {
        alert("Account created! Redirecting to login...");
        window.location.href = "login.html";
    }
});

function showError(message) {
    errorBox.textContent = message;
    errorBox.style.display = "block";
}