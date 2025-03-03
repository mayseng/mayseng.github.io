// script.js
function loadNotes() {
    return JSON.parse(localStorage.getItem('notes')) || {};
}

function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

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

// Make sure the checkPassword function is correctly defined
function checkPassword(event) {
    if (event.key === "Enter") { // Listen for the "Enter" key
        let password = document.getElementById("input").value;
        let passwordSection = document.getElementById("password-section");
        let commandSection = document.getElementById("command-section");

        // Check if password is correct
        if (password === "jj is the best") {  // Password condition
            passwordSection.style.display = "none";  // Hide password input
            commandSection.style.display = "block";  // Show command input
            document.getElementById("input").value = "";  // Clear password field
            document.getElementById("command-input").focus(); // Focus on command input
        } else {
            document.getElementById("input").value = ""; // Clear password field if incorrect
            document.getElementById("error-message").innerHTML = "ERROR: Incorrect password."; // Show error message
        }
    }
}

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
