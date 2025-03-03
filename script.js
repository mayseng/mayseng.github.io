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

        if (command.startsWith("create note")) {
            handleCreateNote(command);
        } else if (command.startsWith("edit note")) {
            handleEditNote(command);
        } else if (command.startsWith("show note")) {
            handleShowNote(command);
        } else if (command === "show notes") {
            handleShowNotes();
        } else if (command.startsWith("delete note")) {
            handleDeleteNote(command);
        } else if (command.startsWith("school test set")) {
            handleSetSchoolTest(command);
        } else if (command.startsWith("school test delete")) {
            handleDeleteSchoolTest(command);
        } else if (command === "school test all") {
            handleShowAllTests();
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        document.getElementById("command-input").value = "";
    }
}

// Notes functions
function handleCreateNote(command) {
    const parts = command.split(" ");
    if (parts.length < 4) {
        document.getElementById("error-message-command").innerHTML = "ERROR: Please provide a name and content for your note.";
        return;
    }
    const noteName = parts[2];
    const noteContent = parts.slice(3).join(" ");
    let notes = loadNotes();
    notes[noteName] = { content: noteContent, tags: [] };
    saveNotes(notes);
    document.getElementById("error-message-command").innerHTML = `Note '${noteName}' created.`;
}

function handleEditNote(command) {
    const parts = command.split(" ");
    if (parts.length < 4) {
        document.getElementById("error-message-command").innerHTML = "ERROR: Please provide a name and new content for your note.";
        return;
    }
    const noteName = parts[2];
    const newContent = parts.slice(3).join(" ");
    let notes = loadNotes();
    if (notes[noteName]) {
        notes[noteName].content = newContent;
        saveNotes(notes);
        document.getElementById("error-message-command").innerHTML = `Note '${noteName}' updated.`;
    } else {
        document.getElementById("error-message-command").innerHTML = "ERROR: Note not found.";
    }
}

function handleShowNote(command) {
    const noteName = command.slice(10).trim();
    let notes = loadNotes();
    if (notes[noteName]) {
        document.getElementById("error-message-command").innerHTML = `<strong>${noteName}:</strong> ${notes[noteName].content}`;
    } else {
        document.getElementById("error-message-command").innerHTML = "ERROR: Note not found.";
    }
}

function handleShowNotes() {
    let notes = loadNotes();
    if (Object.keys(notes).length === 0) {
        document.getElementById("error-message-command").innerHTML = "No notes found.";
    } else {
        document.getElementById("error-message-command").innerHTML = Object.keys(notes).map(name => `<strong>${name}:</strong> ${notes[name].content}`).join("<br>");
    }
}

function handleDeleteNote(command) {
    const noteName = command.slice(12).trim();
    let notes = loadNotes();
    if (notes[noteName]) {
        delete notes[noteName];
        saveNotes(notes);
        document.getElementById("error-message-command").innerHTML = `Note '${noteName}' deleted.`;
    } else {
        document.getElementById("error-message-command").innerHTML = "ERROR: Note not found.";
    }
}

// School test functions
function handleSetSchoolTest(command) {
    const parts = command.split(" ");
    if (parts.length < 5) {
        document.getElementById("error-message-command").innerHTML = "ERROR: Please provide a class and a date.";
        return;
    }
    const className = parts[3];
    const testDate = parts.slice(4).join(" ");
    let reminders = loadReminders();
    if (!reminders.tests) reminders.tests = {};
    if (!reminders.tests[className]) reminders.tests[className] = [];
    reminders.tests[className].push(testDate);
    saveReminders(reminders);
    document.getElementById("error-message-command").innerHTML = `Test for '${className}' set on ${testDate}.`;
}

function handleDeleteSchoolTest(command) {
    const parts = command.split(" ");
    if (parts.length < 5) {
        document.getElementById("error-message-command").innerHTML = "ERROR: Please provide a class and a date to delete.";
        return;
    }
    const className = parts[3];
    const testDate = parts.slice(4).join(" ");
    let reminders = loadReminders();
    if (reminders.tests && reminders.tests[className]) {
        reminders.tests[className] = reminders.tests[className].filter(date => date !== testDate);
        saveReminders(reminders);
        document.getElementById("error-message-command").innerHTML = `Test on '${testDate}' for '${className}' deleted.`;
    } else {
        document.getElementById("error-message-command").innerHTML = "ERROR: Test not found.";
    }
}

function handleShowAllTests() {
    let reminders = loadReminders();
    if (reminders.tests && Object.keys(reminders.tests).length > 0) {
        document.getElementById("error-message-command").innerHTML = Object.entries(reminders.tests).map(([cls, dates]) => `<strong>${cls}:</strong> ${dates.join(", ")}`).join("<br>");
    } else {
        document.getElementById("error-message-command").innerHTML = "No tests scheduled.";
    }
}
