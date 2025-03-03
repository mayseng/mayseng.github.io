// Set up hardcoded user credentials (username and password)
const USERS = {
    "admin": "password123", // Example username: admin, password: password123
    "user": "1234"          // Example username: user, password: 1234
};

// Function to handle the login process
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (USERS[username] && USERS[username] === password) {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("command-section").style.display = "block";
        document.getElementById("command-input").focus();

        // Set prompt to include the username
        document.getElementById("prompt").innerText = `C:\${username}> `;
    } else {
        document.getElementById("error-message").style.display = "block";
    }
}

// Function to handle commands for notes and school reminders
function checkCommand(event) {
    if (event.key === "Enter") {
        let command = document.getElementById("command-input").value.trim();
        let errorMessage = document.getElementById("error-message-command");
        let notesContainer = document.getElementById("notes-container");

        errorMessage.innerHTML = '';  // Reset error message

        if (command.startsWith("create note")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a name and content for your note.";
                return;
            }
            const noteName = parts[2];
            const noteContent = parts.slice(3).join(" "); // Join the rest as content
            let notes = loadNotes();
            notes[noteName] = { content: noteContent, tags: [] }; // Store content and tags
            saveNotes(notes);
        } else if (command.startsWith("edit note")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a name and new content for your note.";
                return;
            }
            const noteName = parts[2];
            const newContent = parts.slice(3).join(" ");
            let notes = loadNotes();
            if (notes[noteName]) {
                notes[noteName].content = newContent; // Update content
                saveNotes(notes);
            } else {
                errorMessage.innerHTML = "ERROR: Note not found.";
            }
        } else if (command.startsWith("school test set")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and a date.";
                return;
            }
            const className = parts[3];
            const testDate = parts.slice(4).join(" ");
            let reminders = loadReminders();
            if (!reminders.tests) reminders.tests = {};
            reminders.tests[className] = testDate;
            saveReminders(reminders);
            errorMessage.innerHTML = `Test for '${className}' set on ${testDate}.`;
        } else if (command.startsWith("school test delete")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and a date.";
                return;
            }
            const className = parts[3];
            let reminders = loadReminders();
            if (reminders.tests && reminders.tests[className]) {
                delete reminders.tests[className];
                saveReminders(reminders);
                errorMessage.innerHTML = `Test for '${className}' deleted.`;
            } else {
                errorMessage.innerHTML = "ERROR: No test found for this class.";
            }
        } else if (command.startsWith("school assignment")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and a date.";
                return;
            }
            const className = parts[2];
            const assignmentDate = parts.slice(3).join(" ");
            let reminders = loadReminders();
            if (!reminders.assignments) reminders.assignments = {};
            reminders.assignments[className] = assignmentDate;
            saveReminders(reminders);
            errorMessage.innerHTML = `Assignment for '${className}' set on ${assignmentDate}.`;
        } else if (command === "help school") {
            errorMessage.innerHTML = `
                School Commands:<br>
                - school test set <class> <date>: Set a test date for a class.<br>
                - school test delete <class>: Delete a test for a specific class.<br>
                - school test <class>: View the test date for a specific class.<br>
                - school test all: View all upcoming test dates.<br>
                - school assignment <class> <date>: Set an assignment due date for a class.<br>
            `;
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        // Clear the input field after command is processed
        document.getElementById("command-input").value = "";
    }
}

// Function to load notes from local storage
function loadNotes() {
    return JSON.parse(localStorage.getItem('notes')) || {};
}

// Function to save notes to local storage
function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Function to load reminders from local storage
function loadReminders() {
    return JSON.parse(localStorage.getItem('reminders')) || {};
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
