// Hardcoded user credentials
const USERS = {
    "admin": "password123",
    "user": "1234",
    "lane": "johnson",
    "maysen": "graber"
};

let currentUser = "";

// Function to handle the login process
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

// Function to check upcoming tests and assignments
function checkUpcomingEvents() {
    const today = new Date().toISOString().split("T")[0];
    let reminders = "";
    
    let tests = loadTests();
    let assignments = loadAssignments();
    
    for (let [className, date] of Object.entries(tests)) {
        if (date === today) {
            reminders += `Reminder: Test for ${className} is today!\n`;
        }
    }

    for (let [className, date] of Object.entries(assignments)) {
        if (date === today) {
            reminders += `Reminder: Assignment for ${className} is due today!\n`;
        }
    }
    
    if (reminders) {
        alert(reminders);
    }
}

// Function to show the calendar
function showCalendar() {
    let calendarSection = document.getElementById("calendar-section");
    let calendarContent = document.getElementById("calendar");
    calendarSection.style.display = "block";
    
    let assignments = loadAssignments();
    let tests = loadTests();
    let content = "<h2>📅 Upcoming Events</h2>";
    
    content += "<h3>📚 Assignments</h3>";
    if (Object.keys(assignments).length === 0) {
        content += "No assignments scheduled.<br>";
    } else {
        for (let [className, date] of Object.entries(assignments)) {
            content += `Assignment for ${className} due on ${date}<br>`;
        }
    }

    content += "<h3>📝 Tests</h3>";
    if (Object.keys(tests).length === 0) {
        content += "No tests scheduled.<br>";
    } else {
        for (let [className, date] of Object.entries(tests)) {
            content += `Test for ${className} on ${date}<br>`;
        }
    }
    
    calendarContent.innerHTML = content;
}

// Function to close the calendar
function closeCalendar() {
    document.getElementById("calendar-section").style.display = "none";
}

// Local storage functions
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
