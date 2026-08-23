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

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        errorBox.textContent = "Please fill in all fields.";
        errorBox.style.display = "block";
        return;
    }

    if (password.length < 6) {
        errorBox.textContent = "Password must be at least 6 characters.";
        errorBox.style.display = "block";
        return;
    }

    if (!selectedRole) {
        errorBox.textContent = "Please select whether you're a passenger or driver.";
        errorBox.style.display = "block";
        return;
    }

    // send the form data to our server
    fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role: selectedRole })
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
                alert("Account created! Redirecting to login...");
                window.location.href = "login.html";
            }
        });
});