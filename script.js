// Hardcoded user credentials
const USERS = {
    "admin": "password123",
    "user": "1234",
    "lane": "johnson",
    "maysen": "graber"
};

let currentUser = "";

// Function to handle login
function login() {
    console.log("Login button clicked!");
    
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    
    if (!username || !password) {
        console.log("Username or password field is empty.");
        return;
    }
    
    if (USERS[username] && USERS[username] === password) {
        currentUser = username;
        console.log("Login successful for:", currentUser);

        document.getElementById("login-container").style.display = "none";
        document.getElementById("command-section").style.display = "block";
        document.getElementById("command-input").focus();
        document.getElementById("prompt").innerText = `C:\\${currentUser}> `;

        checkUpcomingEvents();
    } else {
        console.log("Invalid login credentials.");
        document.getElementById("error-message").style.display = "block";
    }
}

// Function to check upcoming tests & assignments
function checkUpcomingEvents() {
    const today = new Date().toISOString().split("T")[0];
    let reminders = [];
    
    let tests = loadTests();
    let assignments = loadAssignments();
    
    for (let className in tests) {
        if (tests[className] === today) {
            reminders.push(`🔔 Test for ${className} is today!`);
        }
    }

    for (let className in assignments) {
        if (assignments[className] === today) {
            reminders.push(`📌 Assignment for ${className} is due today!`);
        }
    }
    
    if (reminders.length > 0) {
        alert(reminders.join("\n"));
    }
}

// Function to handle commands
function checkCommand(event) {
    if (event.key === "Enter") {
        let command = document.getElementById("command-input").value.trim();
        let errorMessage = document.getElementById("error-message-command");
        errorMessage.innerHTML = "";

        const parts = command.split(" ");

        if (command === "school calendar show") {
            showCalendar();
            errorMessage.innerHTML = "📅 Calendar is now visible.";
        } else if (command === "school calendar close") {
            closeCalendar();
            errorMessage.innerHTML = "📅 Calendar is now hidden.";
        } else if (command.startsWith("school test set")) {
            if (parts.length < 5) {
                errorMessage.innerHTML = "ERROR: Please provide a class and date (YYYY-MM-DD).";
                return;
            }
            let className = parts[3];
            let date = parts[4];
            if (!isValidDate(date)) {
                errorMessage.innerHTML = "ERROR: Invalid date format. Use YYYY-MM-DD.";
                return;
            }
            let tests = loadTests();
            tests[className] = date;
            saveTests(tests);
            errorMessage.innerHTML = `✅ Test for ${className} set on ${date}.`;
            updateCalendar();
        } else if (command.startsWith("school assignment set")) {
            if (parts.length < 5) {
                errorMessage.innerHTML = "ERROR: Please provide a class and due date (YYYY-MM-DD).";
                return;
            }
            let className = parts[3];
            let date = parts[4];
            if (!isValidDate(date)) {
                errorMessage.innerHTML = "ERROR: Invalid date format. Use YYYY-MM-DD.";
                return;
            }
            let assignments = loadAssignments();
            assignments[className] = date;
            saveAssignments(assignments);
            errorMessage.innerHTML = `✅ Assignment for ${className} due on ${date}.`;
            updateCalendar();
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        document.getElementById("command-input").value = "";
    }
}

// Function to show the calendar
function showCalendar() {
    document.getElementById("calendar-section").style.display = "block";
    updateCalendar();
}

// Function to close the calendar
function closeCalendar() {
    document.getElementById("calendar-section").style.display = "none";
}

// Function to update the calendar with test & assignment dates
function updateCalendar() {
    let calendarDiv = document.getElementById("calendar");
    calendarDiv.innerHTML = "<h3>Upcoming Events</h3>";
    
    let tests = loadTests();
    let assignments = loadAssignments();
    
    if (Object.keys(tests).length === 0 && Object.keys(assignments).length === 0) {
        calendarDiv.innerHTML += "<p>No upcoming events.</p>";
        return;
    }

    let eventList = "<ul>";
    
    for (let className in tests) {
        eventList += `<li>📝 Test for <b>${className}</b> on <b>${tests[className]}</b></li>`;
    }

    for (let className in assignments) {
        eventList += `<li>📂 Assignment for <b>${className}</b> due on <b>${assignments[className]}</b></li>`;
    }

    eventList += "</ul>";
    calendarDiv.innerHTML += eventList;
}

// Function to validate date format (YYYY-MM-DD)
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

// Local storage functions (User-specific)
function loadTests() {
    return JSON.parse(localStorage.getItem(`${currentUser}_tests`)) || {};
}
function saveTests(tests) {
    localStorage.setItem(`${currentUser}_tests`, JSON.stringify(tests));
}

function loadAssignments() {
    return JSON.parse(localStorage.getItem(`${currentUser}_assignments`)) || {};
}
function saveAssignments(assignments) {
    localStorage.setItem(`${currentUser}_assignments`, JSON.stringify(assignments));
}

// Ensure login form is shown on page load
window.onload = function() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("command-section").style.display = "none";
};
