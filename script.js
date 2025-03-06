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
            if (parts.length < 4) {
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
            errorMessage.innerHTML = Object.keys(tests).length === 0 ? "No tests scheduled." : JSON.stringify(tests);
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
            if (parts.length < 4) {
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
            errorMessage.innerHTML = Object.keys(assignments).length === 0 ? "No assignments scheduled." : JSON.stringify(assignments);
        } else if (command.startsWith("school calendar show")) {
            showCalendar();
        } else if (command.startsWith("help school")) {
            errorMessage.innerHTML = "Commands: school test set <class> <date>, school test all, school test delete <class>, school assignment set <class> <date>, school assignment all, school assignment delete <class>.";
        } else if (command.startsWith("help notes")) {
            errorMessage.innerHTML = "Commands: notes create <title> <content>, notes view <title>, notes delete <title>.";
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        document.getElementById("command-input").value = "";
    }
}

// Calendar display function
function showCalendar() {
    let calendarSection = document.getElementById("calendar-section");
    let calendarContent = document.getElementById("calendar");
    calendarContent.innerHTML = "<h2>📅 Upcoming Events</h2>";
    
    let tests = loadTests();
    let assignments = loadAssignments();
    
    if (Object.keys(tests).length === 0 && Object.keys(assignments).length === 0) {
        calendarContent.innerHTML += "<p>No upcoming events.</p>";
    } else {
        for (let className in tests) {
            calendarContent.innerHTML += `<p>📝 Test: ${className} on ${tests[className]}</p>`;
        }
        for (let className in assignments) {
            calendarContent.innerHTML += `<p>📚 Assignment: ${className} due on ${assignments[className]}</p>`;
        }
    }
    
    calendarSection.style.display = "block";
}

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

window.onload = function() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("command-section").style.display = "none";
};
