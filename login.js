const form = document.querySelector(".auth-form");
const errorBox = document.getElementById("form-error");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const savedUserJSON = localStorage.getItem("registeredUser");

    if (!savedUserJSON) {
        errorBox.textContent = "No account found. Please sign up first.";
        errorBox.style.display = "block";
        return;
    }

    const savedUser = JSON.parse(savedUserJSON);

    if (email === savedUser.email && password === savedUser.password) {
        errorBox.style.display = "none";
        alert("Welcome back, " + savedUser.name + "!");
    } else {
        errorBox.textContent = "Incorrect email or password.";
        errorBox.style.display = "block";
    }
});