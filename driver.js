/* =========================================================
   RIDE SHARING SYSTEM
   Main JavaScript
========================================================= */


/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultVehicles = [
    {
        id: 1,
        make: "Toyota",
        model: "Corolla",
        color: "White",
        plate: "ABC-123",
        seats: 3,
        status: "Active"
    },

    {
        id: 2,
        make: "Honda",
        model: "Civic",
        color: "Black",
        plate: "XYZ-789",
        seats: 3,
        status: "Active"
    }
];


const defaultRides = [
    {
        id: 1,
        vehicleId: 1,
        origin: "Peshawar",
        destination: "Islamabad",
        departure: "2026-08-25T09:00",
        seats: 3,
        status: "Active"
    }
];


/* =========================================================
   AUTHENTICATION
========================================================= */

const defaultUsers = [
    {
        name: "Musa",
        email: "musa@gmail.com",
        password: "musa123"
    }
];


let users =
    JSON.parse(localStorage.getItem("users")) ||
    defaultUsers;


let currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    null;


let isSignUpMode = false;


function saveUsers() {

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}


function saveCurrentUser() {

    if (currentUser) {

        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );

    } else {

        localStorage.removeItem("currentUser");

    }

}


function updateUserDetails() {

    if (!currentUser) {
        return;
    }

    const userNameElements = [
        document.getElementById("currentUserName"),
        document.getElementById("dashboardUserName"),
        document.getElementById("profileUserName")
    ];

    userNameElements.forEach(function (element) {
        if (element) {
            element.textContent = currentUser.name;
        }
    });

    const emailElement =
        document.getElementById("profileUserEmail");

    if (emailElement) {
        emailElement.textContent = currentUser.email;
    }

}


function setAuthenticated(user) {

    currentUser = {
        name: user.name,
        email: user.email
    };

    saveCurrentUser();

    document
        .getElementById("authScreen")
        .classList.add("hidden");

    document
        .querySelector(".app-container")
        .classList.remove("hidden");

    updateUserDetails();

}


function showAuthError(message) {

    document
        .getElementById("authError")
        .textContent = message;

}


function setAuthMode(signUp) {

    isSignUpMode = signUp;

    document
        .getElementById("authTitle")
        .textContent = signUp
            ? "Create your account"
            : "Sign in to your account";

    document
        .getElementById("authSubtitle")
        .textContent = signUp
            ? "Join the ride sharing system as a driver."
            : "Use your account to manage rides and vehicles.";

    document
        .getElementById("nameField")
        .classList.toggle("hidden", !signUp);

    document
        .getElementById("authName")
        .required = signUp;

    document
        .getElementById("authPassword")
        .autocomplete = signUp
            ? "new-password"
            : "current-password";

    document
        .getElementById("authSubmit")
        .textContent = signUp ? "Create Account" : "Sign In";

    document
        .getElementById("authToggle")
        .textContent = signUp
            ? "Already have an account? Sign in"
            : "Create a new account";

    showAuthError("");

}


function initializeAuth() {

    const authForm =
        document.getElementById("authForm");

    document
        .getElementById("authToggle")
        .addEventListener(
            "click",
            function () {
                setAuthMode(!isSignUpMode);
            }
        );

    authForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById("authName").value.trim();

            const email =
                document.getElementById("authEmail").value.trim().toLowerCase();

            const password =
                document.getElementById("authPassword").value;

            if (isSignUpMode) {

                if (name.length < 2) {
                    showAuthError("Please enter your full name.");
                    return;
                }

                if (password.length < 6) {
                    showAuthError("Password must be at least 6 characters.");
                    return;
                }

                if (users.some(function (user) {
                    return user.email === email;
                })) {
                    showAuthError("An account with this email already exists.");
                    return;
                }

                const newUser = {
                    name: name,
                    email: email,
                    password: password
                };

                users.push(newUser);
                saveUsers();
                setAuthenticated(newUser);

            } else {

                const user = users.find(function (savedUser) {
                    return (
                        savedUser.email === email &&
                        savedUser.password === password
                    );
                });

                if (!user) {
                    showAuthError("Email or password is incorrect.");
                    return;
                }

                setAuthenticated(user);

            }

            authForm.reset();
            setAuthMode(false);

        }
    );

    if (currentUser) {
        setAuthenticated(currentUser);
    } else {
        document
            .querySelector(".app-container")
            .classList.add("hidden");
    }

}


/* =========================================================
   APPLICATION STATE
========================================================= */

let vehicles =
    JSON.parse(localStorage.getItem("vehicles")) ||
    defaultVehicles;


let rides =
    JSON.parse(localStorage.getItem("rides")) ||
    defaultRides;


let profile =
    JSON.parse(localStorage.getItem("profile")) ||
    {
        phone: ""
    };


/* =========================================================
   INITIALIZE APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeAuth();

        renderVehicles();

        renderVehicleOptions();

        renderRides();

        updateDashboard();

        updateChecklist();

    }
);


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(
        function (page) {

            page.classList.remove(
                "active-page"
            );

        }
    );


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {

        selectedPage.classList.add(
            "active-page"
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

}


/* =========================================================
   SAVE DATA
========================================================= */

function saveVehicles() {

    localStorage.setItem(
        "vehicles",
        JSON.stringify(vehicles)
    );

}


function saveRides() {

    localStorage.setItem(
        "rides",
        JSON.stringify(rides)
    );

}


function saveProfile() {

    localStorage.setItem(
        "profile",
        JSON.stringify(profile)
    );

}


/* =========================================================
   RENDER VEHICLES
========================================================= */

function renderVehicles() {

    const tableBody =
        document.getElementById(
            "vehicleTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (vehicles.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="empty-vehicles">
                        No vehicles added yet.
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    vehicles.forEach(
        function (vehicle) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(vehicle.make)}
                    ${escapeHTML(vehicle.model)}
                </td>

                <td>
                    ${escapeHTML(vehicle.plate)}
                </td>

                <td>
                    ${vehicle.seats}
                </td>

                <td>
                    <span class="status-badge">
                        ${escapeHTML(vehicle.status)}
                    </span>
                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


/* =========================================================
   VEHICLE SELECT OPTIONS
========================================================= */

function renderVehicleOptions() {

    const select =
        document.getElementById(
            "rideVehicle"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select your vehicle
        </option>
    `;


    vehicles.forEach(
        function (vehicle) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                vehicle.id;


            option.textContent =
                `${vehicle.make} ${vehicle.model} - ${vehicle.plate}`;


            select.appendChild(option);

        }
    );

}


/* =========================================================
   ADD VEHICLE
========================================================= */

const vehicleForm =
    document.getElementById(
        "vehicleForm"
    );


if (vehicleForm) {

    vehicleForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const make =
                document
                    .getElementById("make")
                    .value
                    .trim();


            const model =
                document
                    .getElementById("model")
                    .value
                    .trim();


            const color =
                document
                    .getElementById("color")
                    .value
                    .trim();


            const plate =
                document
                    .getElementById("plate")
                    .value
                    .trim()
                    .toUpperCase();


            const capacity =
                Number(
                    document
                        .getElementById("capacity")
                        .value
                );


            /* Prevent duplicate plate numbers */

            const duplicate =
                vehicles.some(
                    function (vehicle) {

                        return (
                            vehicle.plate.toLowerCase() ===
                            plate.toLowerCase()
                        );

                    }
                );


            if (duplicate) {

                showToast(
                    "This plate number already exists."
                );

                return;
            }


            const newVehicle = {

                id:
                    Date.now(),

                make:
                    make,

                model:
                    model,

                color:
                    color,

                plate:
                    plate,

                seats:
                    capacity,

                status:
                    "Active"

            };


            vehicles.push(
                newVehicle
            );


            saveVehicles();


            renderVehicles();

            renderVehicleOptions();

            updateDashboard();

            updateChecklist();


            vehicleForm.reset();


            showToast(
                "Vehicle added successfully!"
            );


            setTimeout(
                function () {

                    showPage(
                        "dashboardPage"
                    );

                },
                700
            );

        }
    );

}


/* =========================================================
   POST RIDE
========================================================= */

const rideForm =
    document.getElementById(
        "rideForm"
    );


if (rideForm) {

    rideForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const vehicleId =
                Number(
                    document
                        .getElementById(
                            "rideVehicle"
                        )
                        .value
                );


            const origin =
                document
                    .getElementById(
                        "origin"
                    )
                    .value;


            const destination =
                document
                    .getElementById(
                        "destination"
                    )
                    .value;


            const departure =
                document
                    .getElementById(
                        "departureTime"
                    )
                    .value;


            const seats =
                Number(
                    document
                        .getElementById(
                            "rideSeats"
                        )
                        .value
                );


            if (
                origin === destination
            ) {

                showToast(
                    "Origin and destination cannot be the same."
                );

                return;
            }


            const selectedVehicle =
                vehicles.find(
                    function (vehicle) {

                        return vehicle.id ===
                            vehicleId;

                    }
                );


            if (!selectedVehicle) {

                showToast(
                    "Please select a vehicle."
                );

                return;
            }


            if (
                seats >
                selectedVehicle.seats
            ) {

                showToast(
                    `This vehicle has only ${selectedVehicle.seats} seats.`
                );

                return;
            }


            const newRide = {

                id:
                    Date.now(),

                vehicleId:
                    vehicleId,

                origin:
                    origin,

                destination:
                    destination,

                departure:
                    departure,

                seats:
                    seats,

                status:
                    "Active"

            };


            rides.push(
                newRide
            );


            saveRides();


            renderRides();

            updateDashboard();


            rideForm.reset();


            showToast(
                "Ride posted successfully!"
            );

        }
    );

}


/* =========================================================
   RENDER ACTIVE RIDES
========================================================= */

function renderRides() {

    const container =
        document.getElementById(
            "activeRidesContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (rides.length === 0) {

        container.innerHTML = `

            <div class="empty-rides">

                You don't have any active rides.
                Post a new ride above to get started.

            </div>

        `;

        return;
    }


    rides.forEach(
        function (ride) {

            const vehicle =
                vehicles.find(
                    function (item) {

                        return item.id ===
                            ride.vehicleId;

                    }
                );


            const vehicleName =
                vehicle
                    ? `${vehicle.make} ${vehicle.model}`
                    : "Unknown Vehicle";


            const rideElement =
                document.createElement(
                    "div"
                );


            rideElement.className =
                "ride-item";


            rideElement.innerHTML = `

                <div class="ride-route">

                    <span class="route-point">
                        ${escapeHTML(ride.origin)}
                    </span>

                    <span class="route-arrow">
                        →
                    </span>

                    <span class="route-point">
                        ${escapeHTML(ride.destination)}
                    </span>

                </div>


                <div class="ride-info">

                    <span class="ride-vehicle">
                        🚗 ${escapeHTML(vehicleName)}
                    </span>

                    <span>
                        ${formatDate(ride.departure)}
                    </span>

                    <span>
                        ${ride.seats} seats
                    </span>

                </div>


                <button
                    class="remove-ride"
                    onclick="removeRide(${ride.id})">

                    Remove

                </button>

            `;


            container.appendChild(
                rideElement
            );

        }
    );

}


/* =========================================================
   REMOVE RIDE
========================================================= */

function removeRide(rideId) {

    const confirmed =
        confirm(
            "Are you sure you want to remove this ride?"
        );


    if (!confirmed) {
        return;
    }


    rides =
        rides.filter(
            function (ride) {

                return ride.id !==
                    rideId;

            }
        );


    saveRides();


    renderRides();

    updateDashboard();


    showToast(
        "Ride removed."
    );

}


/* =========================================================
   UPDATE DASHBOARD STATISTICS
========================================================= */

function updateDashboard() {

    const totalRides =
        document.getElementById(
            "totalRides"
        );


    const activeRidesCount =
        document.getElementById(
            "activeRidesCount"
        );


    const vehicleCount =
        document.getElementById(
            "vehicleCount"
        );


    if (totalRides) {

        totalRides.textContent =
            rides.length;

    }


    if (activeRidesCount) {

        activeRidesCount.textContent =
            rides.filter(
                function (ride) {

                    return ride.status ===
                        "Active";

                }
            ).length;

    }


    if (vehicleCount) {

        vehicleCount.textContent =
            vehicles.length;

    }

}


/* =========================================================
   CHECKLIST
========================================================= */

function getChecklistStatus() {

    const identityVerified =
        true;


    const vehicleRegistered =
        vehicles.length > 0;


    const phoneAdded =
        profile.phone !== "";


    return [
        identityVerified,
        vehicleRegistered,
        phoneAdded
    ];

}


function updateChecklist() {

    const checklist =
        getChecklistStatus();


    const vehicleRegistered =
        checklist[1];


    const phoneAdded =
        checklist[2];


    const completed =
        checklist.filter(
            function (item) {

                return item === true;

            }
        ).length;


    const total =
        checklist.length;


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    /* Dashboard progress */

    const progressPercentage =
        document.getElementById(
            "progressPercentage"
        );


    const progressFill =
        document.getElementById(
            "progressFill"
        );


    const setupMessage =
        document.getElementById(
            "setupMessage"
        );


    if (progressPercentage) {

        progressPercentage.textContent =
            `${percentage}%`;

    }


    if (progressFill) {

        progressFill.style.width =
            `${percentage}%`;

    }


    if (setupMessage) {

        if (percentage === 100) {

            setupMessage.textContent =
                "All steps complete — you're ready to drive!";

        } else {

            setupMessage.textContent =
                `${completed} of ${total} setup steps completed.`;

        }

    }


    /* Checklist page */

    const checklistProgressBar =
        document.getElementById(
            "checklistProgressBar"
        );


    const checklistProgressText =
        document.getElementById(
            "checklistProgressText"
        );


    if (checklistProgressBar) {

        checklistProgressBar.style.width =
            `${percentage}%`;

    }


    if (checklistProgressText) {

        checklistProgressText.textContent =
            `${percentage}% setup complete`;

    }


    /* Vehicle item */

    const vehicleItem =
        document.getElementById(
            "vehicleChecklistItem"
        );


    const vehicleIcon =
        document.getElementById(
            "vehicleCheckIcon"
        );


    const vehicleText =
        document.getElementById(
            "vehicleChecklistText"
        );


    if (vehicleRegistered) {

        vehicleItem.classList.remove(
            "incomplete"
        );

        vehicleIcon.textContent =
            "✓";

        vehicleText.textContent =
            "Active vehicle registration on file";

    } else {

        vehicleItem.classList.add(
            "incomplete"
        );

        vehicleIcon.textContent =
            "×";

        vehicleText.textContent =
            "No vehicle registered";

    }


    /* Phone item */

    const phoneItem =
        document.getElementById(
            "phoneChecklistItem"
        );


    const phoneIcon =
        document.getElementById(
            "phoneCheckIcon"
        );


    const phoneText =
        document.getElementById(
            "phoneChecklistText"
        );


    if (phoneAdded) {

        phoneItem.classList.remove(
            "incomplete"
        );

        phoneIcon.textContent =
            "✓";

        phoneText.textContent =
            "Phone number added successfully";


    } else {

        phoneItem.classList.add(
            "incomplete"
        );

        phoneIcon.textContent =
            "×";

        phoneText.textContent =
            "No phone number added";

    }

}


/* =========================================================
   PHONE MODAL
========================================================= */

function addPhone() {

    const modal =
        document.getElementById(
            "phoneModal"
        );


    modal.classList.add(
        "show"
    );

}


function closePhoneModal() {

    const modal =
        document.getElementById(
            "phoneModal"
        );


    modal.classList.remove(
        "show"
    );

}


function savePhone() {

    const phoneInput =
        document.getElementById(
            "phoneNumber"
        );


    const phone =
        phoneInput.value.trim();


    if (phone === "") {

        showToast(
            "Please enter your phone number."
        );

        return;
    }


    if (phone.length < 7) {

        showToast(
            "Please enter a valid phone number."
        );

        return;
    }


    profile.phone =
        phone;


    saveProfile();


    updateChecklist();


    phoneInput.value = "";


    closePhoneModal();


    showToast(
        "Phone number added successfully!"
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "No time";
    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleString(
        "en-US",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   SECURITY HELPER
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );

    if (!confirmed) {
        return;
    }

    currentUser = null;
    saveCurrentUser();

    document
        .querySelector(".app-container")
        .classList.add("hidden");

    document
        .getElementById("authScreen")
        .classList.remove("hidden");

    setAuthMode(false);
    showToast("You have been logged out.");

}


