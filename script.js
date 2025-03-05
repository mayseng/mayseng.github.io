// Hardcoded user credential
const USERS = {
    "admin": "password123",
    "user": "1234",
    "lane": "johnson",
    "maysen": "graber"
};

let currentUser = "";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA8p0gn75hpg_nWMGCmVvwMhPFN5H8ETU",
  authDomain: "secretministration.firebaseapp.com",
  projectId: "secretministration",
  storageBucket: "secretministration.appspot.com",
  messagingSenderId: "944614356878",
  appId: "1:944614356878:web:53b8f0b17fa72735cbd6df",
  measurementId: "G-S7PHLY2VVZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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
    
    for (let test in tests) {
        if (tests[test] === today) {
            reminders += `Reminder: Test for ${test} is today!\n`;
        }
    }

    for (let assignment in assignments) {
        if (assignments[assignment] === today) {
            reminders += `Reminder: Assignment for ${assignment} is due today!\n`;
        }
    }
    
    if (reminders) {
        alert(reminders);
    }
}

// Function to save user data to Firebase
tfunction saveUserData(username, data) {
    database.ref("users/" + username).set(data);
}

// Function to retrieve user data from Firebase
function getUserData(username) {
    database.ref("users/" + username).once("value", function(snapshot) {
        console.log(snapshot.val()); // Shows the user's data
    });
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
            saveUserData(currentUser, { tests }); // Save to Firebase
            errorMessage.innerHTML = `Test for ${className} set on ${date}.`;
        } else if (command === "school test all") {
            let tests = loadTests();
            errorMessage.innerHTML = Object.keys(tests).length === 0 ? "No tests scheduled." : JSON.stringify(tests);
        } else if (command.startsWith("school test delete")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class and date.";
                return;
            }
            let className = parts[3];
            let tests = loadTests();
            if (tests[className]) {
                delete tests[className];
                saveTests(tests);
                saveUserData(currentUser, { tests }); // Save to Firebase
                errorMessage.innerHTML = `Test for ${className} deleted.`;
            } else {
                errorMessage.innerHTML = "ERROR: Test not found.";
            }
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        document.getElementById("command-input").value = "";
    }
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

// Ensure login form is shown on page load
window.onload = function() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("command-section").style.display = "none";
};
