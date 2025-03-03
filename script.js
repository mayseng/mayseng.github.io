// Set up hardcoded user credentials (username and password)
const USERS = {
    "admin": "password123", // Example username: admin, password: password123
    "user": "1234"          // Example username: user, password: 1234
};

// Function to handle the login process
function login() {
    // Get the username and password entered by the user
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check if the username exists and if the password matches
    if (USERS[username] && USERS[username] === password) {
        // Hide the login form
        document.getElementById("login-container").style.display = "none";

        // Show the password section
        document.getElementById("password-section").style.display = "block";
        document.getElementById("input").focus();

        // Optionally, store the username in localStorage to persist login across sessions
        localStorage.setItem("loggedIn", username);

    } else {
        // Show error message if credentials are invalid
        document.getElementById("error-message").style.display = "block";
    }
}

// Check if the user is already logged in when the page loads
window.onload = function() {
    const loggedInUser = localStorage.getItem("loggedIn");

    // If the user is logged in, skip the login page and show the password section
    if (loggedInUser) {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("password-section").style.display = "block";
        document.getElementById("input").focus();
    } else {
        document.getElementById("login-container").style.display = "block";
    }
};

// Function to load notes from local storage
function loadNotes() {
    return JSON.parse(localStorage.getItem('notes')) || {};
}

// Function to save notes to local storage
function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Function to display notes
function displayNotes() {
    const notes = loadNotes();
    const container = document.getElementById("notes-container");
    container.innerHTML = ''; // Clear previous content
    for (let noteName in notes) {
        let noteDiv = document.createElement("div");
        noteDiv.classList.add("note");
        noteDiv.innerHTML = `<strong>${noteName}:</strong> ${notes[noteName].content} <em>(Tags: ${notes[noteName].tags.join(", ")})</em>`;
        container.appendChild(noteDiv);
    }
    container.style.display = "block"; // Show notes
}

// Function to check the password entered for the note functionality
function checkPassword(event) {
    if (event.key === "Enter") {
        let password = document.getElementById("input").value;
        let passwordSection = document.getElementById("password-section");
        let commandSection = document.getElementById("command-section");

        // Check if the password is correct
        if (password === "jj is the best") {
            passwordSection.style.display = "none";  // Hide password prompt
            commandSection.style.display = "block";  // Show command section
            document.getElementById("input").value = "";  // Clear the input field
            document.getElementById("command-input").focus(); // Focus on command input
        } else {
            document.getElementById("input").value = ""; // Clear password field
            document.getElementById("error-message").innerHTML = "ERROR: Incorrect password.";
        }
    }
}

// Function to handle commands for notes
function checkCommand(event) {
    if (event.key === "Enter") {
        let command = document.getElementById("command-input").value.trim();
        let errorMessage = document.getElementById("error-message");
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
        } else if (command.startsWith("show note")) {
            const noteName = command.slice(10).trim();
            let notes = loadNotes();
            if (notes[noteName]) {
                errorMessage.innerHTML = ''; // Clear previous error
                let noteDiv = document.createElement("div");
                noteDiv.classList.add("note");
                noteDiv.innerHTML = `<strong>${noteName}:</strong> ${notes[noteName].content} <em>(Tags: ${notes[noteName].tags.join(", ")})</em>`;
                notesContainer.appendChild(noteDiv);
                notesContainer.style.display = "block"; // Show notes
            } else {
                errorMessage.innerHTML = "ERROR: Note not found.";
            }
        } else if (command === "show notes" || command === "notes") {
            displayNotes();
        } else if (command.startsWith("delete note")) {
            const noteName = command.slice(12).trim();
            let notes = loadNotes();
            if (notes[noteName]) {
                delete notes[noteName];
                saveNotes(notes);
                errorMessage.innerHTML = `Note "${noteName}" deleted.`;
            } else {
                errorMessage.innerHTML = "ERROR: Note not found.";
            }
        } else if (command === "help notes") {
            errorMessage.innerHTML = `
                Available commands:<br>
                - create note <name> <content>: Create a new note.<br>
                - edit note <name> <new content>: Edit an existing note.<br>
                - show note <name>: Display a specific note.<br>
                - show notes or notes: Display all notes.<br>
                - delete note <name>: Delete a specific note.<br>
            `;
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        // Clear the input field after command is processed
        document.getElementById("command-input").value = "";
    }
}
