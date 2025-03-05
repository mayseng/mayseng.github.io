const USERS = {
    "admin": "password123",
    "user": "1234",
    "lane": "johnson",
    "maysen": "graber"
};

let currentUser = "";

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    
    if (!username || !password) return;
    
    if (USERS[username] && USERS[username] === password) {
        currentUser = username;
        document.getElementById("login-container").style.display = "none";
        document.getElementById("command-section").style.display = "block";
        document.getElementById("command-input").focus();
        document.getElementById("prompt").innerText = `C:\\${currentUser}> `;
        checkUpcomingEvents();
    } else {
        document.getElementById("error-message").style.display = "block";
    }
}

function checkUpcomingEvents() {
    const today = new Date().toISOString().split("T")[0];
    let reminders = "";
    
    let tests = loadTests();
    let assignments = loadAssignments();
    
    for (let test in tests) {
        if (tests[test] === today) reminders += `Reminder: Test for ${test} is today!\n`;
    }
    for (let assignment in assignments) {
        if (assignments[assignment] === today) reminders += `Reminder: Assignment for ${assignment} is due today!\n`;
    }
    
    if (reminders) alert(reminders);
}

function checkCommand(event) {
    if (event.key === "Enter") {
        let command = document.getElementById("command-input").value.trim();
        let errorMessage = document.getElementById("error-message-command");
        errorMessage.innerHTML = "";

        if (command.startsWith("school test set")) {
            const parts = command.split(" ");
            if (parts.length < 5) {
                errorMessage.innerHTML = "ERROR: Provide a class and date.";
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
                errorMessage.innerHTML = "ERROR: Provide a class.";
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
                errorMessage.innerHTML = "ERROR: Provide a class and due date.";
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
        } else if (command.startsWith("school assignment delete")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Provide a class.";
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
        } else if (command === "show calendar") {
            showCalendar();
            errorMessage.innerHTML = "📅 Calendar displayed.";
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        document.getElementById("command-input").value = "";
    }
}

function showCalendar() {
    const calendarContainer = document.getElementById("calendar-container");
    const calendarBody = document.querySelector("#calendar tbody");

    calendarBody.innerHTML = "";

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");

            if (i === 0 && j < firstDay) {
                cell.innerHTML = "";
            } else if (date > lastDate) {
                break;
            } else {
                cell.innerHTML = date;
                let formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
                let tests = loadTests();
                let assignments = loadAssignments();

                if (Object.values(tests).includes(formattedDate)) cell.style.backgroundColor = "red";
                if (Object.values(assignments).includes(formattedDate)) cell.style.backgroundColor = "blue";

                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }

    calendarContainer.style.display = "block";
}

function loadTests() { return JSON.parse(localStorage.getItem(`${currentUser}_tests`)) || {}; }
function saveTests(tests) { localStorage.setItem(`${currentUser}_tests`, JSON.stringify(tests)); }
function loadAssignments() { return JSON.parse(localStorage.getItem(`${currentUser}_assignments`)) || {}; }
function saveAssignments(assignments) { localStorage.setItem(`${currentUser}_assignments`, JSON.stringify(assignments)); }

window.onload = function() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("command-section").style.display = "none";
};
