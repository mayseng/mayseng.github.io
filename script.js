// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDA8p0gn75hpg_nWMGCmVvwMhPFN5H8ETU",
    authDomain: "secretministration.firebaseapp.com",
    projectId: "secretministration",
    storageBucket: "secretministration.firebasestorage.app",
    messagingSenderId: "944614356878",
    appId: "1:944614356878:web:53b8f0b17fa72735cbd6df",
    measurementId: "G-S7PHLY2VVZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

let currentUser = "";

// Function to handle login
function login() {
    console.log("Login button clicked!");
    
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    
    if (!username || !password) {
        console.log("Username or password field is empty.");
        return;
    }
    
    auth.signInWithEmailAndPassword(username, password)
        .then(userCredential => {
            currentUser = userCredential.user.uid;
            console.log("Login successful for:", currentUser);

            document.getElementById("login-container").style.display = "none";
            document.getElementById("command-section").style.display = "block";
            document.getElementById("command-input").focus();
            document.getElementById("prompt").innerText = `C:\\${username}> `;

            checkUpcomingEvents();
        })
        .catch(error => {
            console.log("Invalid login credentials.");
            document.getElementById("error-message").style.display = "block";
        });
}

// Function to check upcoming events
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
            saveTests(className, date);
            errorMessage.innerHTML = `Test for ${className} set on ${date}.`;
        } else if (command === "school test all") {
            loadTests(tests => {
                errorMessage.innerHTML = Object.keys(tests).length === 0 ? "No tests scheduled." : JSON.stringify(tests);
            });
        } else if (command.startsWith("school test delete")) {
            const parts = command.split(" ");
            if (parts.length < 4) {
                errorMessage.innerHTML = "ERROR: Please provide a class.";
                return;
            }
            let className = parts[3];
            deleteTest(className);
            errorMessage.innerHTML = `Test for ${className} deleted.`;
        } else {
            errorMessage.innerHTML = "ERROR: Command not recognized.";
        }

        document.getElementById("command-input").value = "";
    }
}

// Firebase Database Functions
function saveTests(className, date) {
    database.ref(`users/${currentUser}/tests/${className}`).set(date);
}

function loadTests(callback) {
    database.ref(`users/${currentUser}/tests`).once('value').then(snapshot => {
        callback(snapshot.val() || {});
    });
}

function deleteTest(className) {
    database.ref(`users/${currentUser}/tests/${className}`).remove();
}

// Ensure login form is shown on page load
window.onload = function() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("command-section").style.display = "none";
};
