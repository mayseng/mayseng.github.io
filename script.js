// Set up hardcoded user credentials (username and password)
const USERS = {
    "admin": "password123",
    "user": "123"
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

// Function to handle commands for notes and school reminders
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
            let notes = loadNotes();
            notes[noteName] = noteContent;
            saveNotes(notes);
            errorMessage.innerHTML = `Note '${noteName}' created.`;
        } else if (command.startsWith("show note")) {
            const noteName = command.slice(10).trim();
            let notes = loadNotes();
            if (notes[noteName]) {
                errorMessage.innerHTML = `<strong>${noteName}:</strong> ${notes[noteName]}`;
            } else {
                errorMessage.innerHTML = "ERROR: Note not found.";
            }
        } else if (command === "show notes") {
            let notes = loadNotes();
            if (Object.keys(notes).length === 0) {
                errorMessage.innerHTML = "No notes found.";
            } else {
                errorMessage.innerHTML = Object.entries(notes).map(([name, content]) => `<strong>${name}:</strong> ${content}`).join("<br>");
            }
        } else if (command.startsWith("school test set")) {
            const parts = command.split(" ");
            if (parts.length < 5) {
                errorMessage.innerHTML = "ERROR: Please provide a class and a date.";
                return;
            }
            const className = parts[3];
            const testDate = parts[4];

            let schoolData = loadSchoolData();
            if (!schoolData.tests[className]) {
                schoolData.tests[className] = [];
            }
            schoolData.tests[className].push(testDate);
            saveSchoolData(schoolData);

            errorMessage.innerHTML = `Test for '${className}' set on ${testDate}.`;
        } else if (command === "school test all") {
            let schoolData = loadSchoolData();
            if (Object.keys(schoolData.tests).length === 0) {
                errorMessage.innerHTML = "No test reminders found.";
            } else {
                errorMessage.innerHTML = "<strong>Test Reminders:</strong><br>";
                for (let className in schoolData.tests) {
                    errorMessage.innerHTML += `<strong>${className}:</strong> ${schoolData.tests[className].join(", ")}<br>`;
                }
            }
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

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

// Function to load school reminders
function loadSchoolData() {
    return JSON.parse(localStorage.getItem('schoolData')) || { tests: {}, assignments: {} };
}

// Function to save school reminders
function saveSchoolData(data) {
    localStorage.setItem('schoolData', JSON.stringify(data));
}

// Ensure the login form is always shown on page load
window.onload = function() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("command-section").style.display = "none";
};
