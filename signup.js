const roleOptions = document.querySelectorAll(".role-option");
let selectedRole = null;

roleOptions.forEach(function (option) {
    option.addEventListener("click", function () {
        const oldSelection = document.querySelector(".role-option.selected");
        if (oldSelection) {
            oldSelection.classList.remove("selected");
        }
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

    const newUser = {
        name: name,
        email: email,
        password: password,
        role: selectedRole
    };

    localStorage.setItem("registeredUser", JSON.stringify(newUser));

    errorBox.style.display = "none";
    alert("Account created! Redirecting to login...");
    window.location.href = "login.html";
});