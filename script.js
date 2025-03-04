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

        checkReminders(); // Check for upcoming tests & assignments
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
                + "school assignment all - View all assignment reminders<br>"
                + "school assignment delete <class> <date> - Delete an assignment reminder";
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
        } else if (command.startsWith("edit note")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a name and new content for your note.";
                return;
            }
            const noteName = parts[2];
            const newContent = parts.slice(3).join(" ");
            let notes = loadData("notes");
            if (notes[noteName]) {
                notes[noteName].content = newContent;
                saveData("notes", notes);
                errorMessage.innerHTML = `Note '${noteName}' updated.`;
            } else {
                errorMessage.innerHTML = "ERROR: Note not found.";
            }
        } else if (command.startsWith("show note")) {
            const noteName = command.slice(10).trim();
            let notes = loadData("notes");
            if (notes[noteName]) {
                errorMessage.innerHTML = `<strong>${noteName}:</strong> ${notes[noteName].content}`;
            } else {
                errorMessage.innerHTML = "ERROR: Note not found.";
            }
        } else if (command === "show notes") {
            let notes = loadData("notes");
            if (Object.keys(notes).length === 0) {
                errorMessage.innerHTML = "No notes found.";
            } else {
                errorMessage.innerHTML = Object.keys(notes).map(name => `<strong>${name}:</strong> ${notes[name].content}`).join("<br>");
            }
        } else if (command.startsWith("school test set")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and date.";
                return;
            }
            let tests = loadData("tests");
            tests[parts[2]] = parts[3];
            saveData("tests", tests);
            errorMessage.innerHTML = `Test for '${parts[2]}' set on ${parts[3]}.`;
        } else if (command === "school test all") {
            let tests = loadData("tests");
            errorMessage.innerHTML = Object.keys(tests).length === 0 ? "No test reminders found." :
                Object.entries(tests).map(([cls, date]) => `<strong>${cls}:</strong> ${date}`).join("<br>");
        } else if (command.startsWith("school test delete")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and date.";
                return;
            }
            let tests = loadData("tests");
            if (tests[parts[2]] === parts[3]) {
                delete tests[parts[2]];
                saveData("tests", tests);
                errorMessage.innerHTML = `Test for '${parts[2]}' on ${parts[3]} deleted.`;
            } else {
                errorMessage.innerHTML = "ERROR: Test not found.";
            }
        } else if (command.startsWith("school assignment set")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and date.";
                return;
            }
            let assignments = loadData("assignments");
            assignments[parts[2]] = parts[3];
            saveData("assignments", assignments);
            errorMessage.innerHTML = `Assignment for '${parts[2]}' set on ${parts[3]}.`;
        } else if (command === "school assignment all") {
            let assignments = loadData("assignments");
            errorMessage.innerHTML = Object.keys(assignments).length === 0 ? "No assignment reminders found." :
                Object.entries(assignments).map(([cls, date]) => `<strong>${cls}:</strong> ${date}`).join("<br>");
        } else if (command.startsWith("school assignment delete")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and date.";
                return;
            }
            let assignments = loadData("assignments");
            if (assignments[parts[2]] === parts[3]) {
                delete assignments[parts[2]];
                saveData("assignments", assignments);
                errorMessage.innerHTML = `Assignment for '${parts[2]}' on ${parts[3]} deleted.`;
            } else {
                errorMessage.innerHTML = "ERROR: Assignment not found.";
            }
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        document.getElementById("command-input").value = "";
    }
}

// Function to load data
function loadData(type) {
    return JSON.parse(localStorage.getItem(type)) || {};
}

// Function to save data
function saveData(type, data) {
    localStorage.setItem(type, JSON.stringify(data));
}

// AI-powered reminder system
function checkReminders() {
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let formattedTomorrow = tomorrow.toISOString().split('T')[0];

    let tests = loadData("tests");
    let assignments = loadData("assignments");
    
    let messages = [];
    
    Object.entries(tests).forEach(([cls, date]) => {
        if (date === formattedTomorrow) messages.push(`Reminder: Test for '${cls}' is tomorrow!`);
    });

    Object.entries(assignments).forEach(([cls, date]) => {
        if (date === formattedTomorrow) messages.push(`Reminder: Assignment for '${cls}' is due tomorrow!`);
    });

    if (messages.length) alert(messages.join("\n"));
}
