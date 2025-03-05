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

// Function to check upcoming events
function checkUpcomingEvents() {
    const today = new Date().toISOString().split("T")[0];
    let reminders = "";

    let tests = loadTests();
    let assignments = loadAssignments();

    for (let className in tests) {
        if (tests[className] === today) {
            reminders += `Reminder: Test for ${className} is today!\n`;
        }
    }

    for (let className in assignments) {
        if (assignments[className] === today) {
            reminders += `Reminder: Assignment for ${className} is due today!\n`;
        }
    }

    if (reminders) {
        alert(reminders);
    }
}

// Function to handle commands
function checkCommand(event) {
    if (event.key === "Enter") {
        let command = document.getElementById("command-input").value.trim();
        let errorMessage = document.getElementById("error-message-command");
        errorMessage.innerHTML = "";

        if (command.startsWith("school test set")) {
            const parts = command.split(" ");
            if (parts.length < 5) {
                errorMessage.innerHTML = "ERROR: Please provide a class and date.";
                return;
            }
            let className = parts[3];
            let date = parts[4];
            let tests = loadTests();
            tests[className] = date;
            saveTests(tests);
            errorMessage.innerHTML = `Test for ${className} set on ${date}.`;
        } else if (command === "school test all") {
            let tests = loadTests();
            errorMessage.innerHTML = Object.keys(tests).length === 0 ? "No tests scheduled." : formatEventList(tests);
        } else if (command.startsWith("school test delete")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class.";
                return;
            }
            let className = parts[3];
            let tests = loadTests();
            if (tests[className]) {
                delete tests[className];
                saveTests(tests);
                errorMessage.innerHTML = `Test for ${className} deleted.`;
            } else {
                errorMessage.innerHTML = "ERROR: Test not found.";
            }
        } else if (command.startsWith("school assignment set")) {
            const parts = command.split(" ");
            if (parts.length < 5) {
                errorMessage.innerHTML = "ERROR: Please provide a class and due date.";
                return;
            }
            let className = parts[3];
            let date = parts[4];
            let assignments = loadAssignments();
            assignments[className] = date;
            saveAssignments(assignments);
            errorMessage.innerHTML = `Assignment for ${className} due on ${date}.`;
        } else if (command === "school assignment all") {
            let assignments = loadAssignments();
            errorMessage.innerHTML = Object.keys(assignments).length === 0 ? "No assignments scheduled." : formatEventList(assignments);
        } else if (command.startsWith("school assignment delete")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class.";
                return;
            }
            let className = parts[3];
            let assignments = loadAssignments();
            if (assignments[className]) {
                delete assignments[className];
                saveAssignments(assignments);
                errorMessage.innerHTML = `Assignment for ${className} deleted.`;
            } else {
                errorMessage.innerHTML = "ERROR: Assignment not found.";
            }
        } else if (command === "school calendar show") {
            showCalendar();
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        document.getElementById("command-input").value = "";
    }
}

// Function to show the calendar
function showCalendar() {
    let calendarSection = document.getElementById("calendar-section");
    let calendarDiv = document.getElementById("calendar");

    let tests = loadTests();
    let assignments = loadAssignments();

    calendarDiv.innerHTML = "<h2>📅 Upcoming Events</h2>";

    if (Object.keys(tests).length === 0 && Object.keys(assignments).length === 0) {
        calendarDiv.innerHTML += "<p>No upcoming events.</p>";
    } else {
        if (Object.keys(assignments).length > 0) {
            calendarDiv.innerHTML += "<h3>📚 Assignments</h3><ul>";
            for (let [className, dueDate] of Object.entries(assignments)) {
                calendarDiv.innerHTML += `<li><b>${className}</b>: Due <b>${dueDate}</b></li>`;
            }
            calendarDiv.innerHTML += "</ul>";
        }
        if (Object.keys(tests).length > 0) {
            calendarDiv.innerHTML += "<h3>📝 Tests</h3><ul>";
            for (let [className, testDate] of Object.entries(tests)) {
                calendarDiv.innerHTML += `<li><b>${className}</b>: <b>${testDate}</b></li>`;
            }
            calendarDiv.innerHTML += "</ul>";
        }
    }

    calendarDiv.innerHTML += '<button onclick="closeCalendar()">Close Calendar</button>';
    calendarSection.style.display = "block";
}

// Function to close the calendar
function closeCalendar() {
    document.getElementById("calendar-section").style.display = "none";
}

// Local storage functions
function loadTests() {
    let tests = localStorage.getItem(`${currentUser}_tests`);
    return tests ? JSON.parse(tests) : {};
}

function saveTests(tests) {
    localStorage.setItem(`${currentUser}_tests`, JSON.stringify(tests));
}

function loadAssignments() {
    let assignments = localStorage.getItem(`${currentUser}_assignments`);
    return assignments ? JSON.parse(assignments) : {};
}

function saveAssignments(assignments) {
    localStorage.setItem(`${currentUser}_assignments`, JSON.stringify(assignments));
}

// Function to format assignments and tests
function formatEventList(events) {
    return Object.entries(events)
        .map(([className, date]) => `<b>${className}</b>: Due <b>${date}</b>`)
        .join("<br>");
}

// Ensure login form is shown on page load
window.onload = function() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("command-section").style.display = "none";
};
