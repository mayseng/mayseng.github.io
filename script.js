// Set up hardcoded user credentials (username and password)
const USERS = {
    "admin": "password123",
    "user": "1234",
    "lane": "johnson",
    "maysen": "graber"
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
        document.getElementById("prompt").innerText = `C:\\${currentUser}> `;
    } else {
        document.getElementById("error-message").style.display = "block";
    }
}

// Function to handle commands
function checkCommand(event) {
    if (event.key === "Enter") {
        let command = document.getElementById("command-input").value.trim();
        let errorMessage = document.getElementById("error-message-command");

        errorMessage.innerHTML = '';

        if (command === "help notes") {
            errorMessage.innerHTML = "<strong>Notes Commands:</strong><br>"
                + "create note <name> <content> - Create a note<br>"
                + "edit note <name> <new content> - Edit a note<br>"
                + "show note <name> - View a note<br>"
                + "show notes - View all notes<br>"
                + "delete note <name> - Delete a note";
        } else if (command === "help school") {
            errorMessage.innerHTML = "<strong>School Commands:</strong><br>"
                + "school test set <class> <date> - Set a test reminder<br>"
                + "school test all - View all test reminders<br>"
                + "school test delete <class> <date> - Delete a test reminder<br>"
                + "school assignment set <class> <date> - Set an assignment reminder<br>"
                + "school assignment all - View all assignment reminders";
        } else if (command.startsWith("create note")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a name and content for your note.";
                return;
            }
            const noteName = parts[2];
            const noteContent = parts.slice(3).join(" ");
            let notes = loadData("notes");
            notes[noteName] = { content: noteContent };
            saveData("notes", notes);
            errorMessage.innerHTML = `Note '${noteName}' created.`;
        } else if (command.startsWith("school test set")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and date.";
                return;
            }
            const className = parts[3];
            const date = parts[4];
            let tests = loadData("tests");
            tests.push({ className, date });
            saveData("tests", tests);
            errorMessage.innerHTML = `Test for ${className} on ${date} added.`;
        } else if (command === "school test all") {
            let tests = loadData("tests");
            if (tests.length === 0) {
                errorMessage.innerHTML = "No tests scheduled.";
            } else {
                errorMessage.innerHTML = tests.map(test => `<strong>${test.className}:</strong> ${test.date}`).join("<br>");
            }
        } else if (command.startsWith("school test delete")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and date to delete.";
                return;
            }
            const className = parts[3];
            const date = parts[4];
            let tests = loadData("tests");
            let newTests = tests.filter(test => !(test.className === className && test.date === date));
            saveData("tests", newTests);
            errorMessage.innerHTML = `Test for ${className} on ${date} deleted.`;
        } else if (command.startsWith("school assignment set")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and due date.";
                return;
            }
            const className = parts[3];
            const dueDate = parts[4];
            let assignments = loadData("assignments");
            assignments.push({ className, dueDate });
            saveData("assignments", assignments);
            errorMessage.innerHTML = `Assignment for ${className} due on ${dueDate} added.`;
        } else if (command === "school assignment all") {
            let assignments = loadData("assignments");
            if (assignments.length === 0) {
                errorMessage.innerHTML = "No assignments scheduled.";
            } else {
                errorMessage.innerHTML = assignments.map(a => `<strong>${a.className}:</strong> ${a.dueDate}`).join("<br>");
            }
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        document.getElementById("command-input").value = "";
    }
}

// Function to load user-specific data
function loadData(key) {
    let data = JSON.parse(localStorage.getItem(currentUser + "_" + key)) || [];
    return data;
}

// Function to save user-specific data
function saveData(key, value) {
    localStorage.setItem(currentUser + "_" + key, JSON.stringify(value));
}

// Ensure login form is shown on page load
window.onload = function() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("command-section").style.display = "none";
};
