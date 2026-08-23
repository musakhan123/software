const approveButtons = document.querySelectorAll(".btn-approve");
const rejectButtons = document.querySelectorAll(".btn-reject");

approveButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const row = button.closest("tr");
        const statusBadge = row.querySelector(".status");
        statusBadge.textContent = "Approved";
        statusBadge.classList.remove("pending");
        statusBadge.classList.add("approved");
    });
});

rejectButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        button.closest("tr").remove();
    });
});