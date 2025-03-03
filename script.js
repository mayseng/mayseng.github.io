// Set up hardcoded user credentials (username and password)
const USERS = {
    "admin": "password123",
    "user": "1234"
};

let currentUser = "";

// Function to handle the login process
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (USERS[username] && USERS[username] === password) {
        currentUser = username;
        document.getElementById("login-container").style.display = "none";
        document.getElementById("command-section").style.display = "block";
        document.getElementById("command-input").focus();
        document.getElementById("prompt").innerText = `C:\${currentUser}> `;
    } else {
        document.getElementById("error-message").style.display = "block";
    }
}

// Function to handle commands for notes and school reminders
function checkCommand(event) {
    if (event.key === "Enter") {
        let command = document.getElementById("command-input").value.trim();
        let errorMessage = document.getElementById("error-message-command");
        errorMessage.innerHTML = '';

        if (command.startsWith("school test set")) {
            handleSchoolTestSet(command, errorMessage);
        } else if (command === "school test all") {
            handleShowAllTests(errorMessage);
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        document.getElementById("command-input").value = "";
    }
}

function handleSchoolTestSet(command, errorMessage) {
    const parts = command.split(" ");
    if (parts.length < 5) {
        errorMessage.innerHTML = "ERROR: Please provide a class and a date.";
        return;
    }
    const className = parts[3];
    const testDate = parts.slice(4).join(" ");
    let reminders = loadReminders();
    if (!reminders.tests) reminders.tests = {};
    if (!reminders.tests[className]) reminders.tests[className] = [];
    reminders.tests[className].push(testDate);
    saveReminders(reminders);
    errorMessage.innerHTML = `Test for '${className}' set on ${testDate}.`;
}

function handleShowAllTests(errorMessage) {
    let reminders = loadReminders();
    if (reminders.tests && Object.keys(reminders.tests).length > 0) {
        errorMessage.innerHTML = Object.entries(reminders.tests)
            .map(([cls, dates]) => `<strong>${cls}:</strong> ${dates.join(", ")}`)
            .join("<br>");
    } else {
        errorMessage.innerHTML = "No tests scheduled.";
    }
}

// Function to load reminders from local storage
function loadReminders() {
    return JSON.parse(localStorage.getItem('reminders')) || { tests: {} };
}

// Function to save reminders to local storage
function saveReminders(reminders) {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

// Ensure the login form is always shown on page load
window.onload = function() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("command-section").style.display = "none";
};
