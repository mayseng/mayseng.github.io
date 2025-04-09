// script.js
const output = document.getElementById('output');
const input = document.getElementById('input');
const username = 'user'; // Set your username here
const password = 'pass'; // Set your password here
let authenticated = false;

input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const command = input.value.trim();
        input.value = '';

        if (!authenticated) {
            handleLogin(command);
        } else {
            handleCommand(command);
        }

        output.scrollTop = output.scrollHeight;
    }
});

function handleLogin(command) {
    const [user, pass] = command.split(' ');

    if (user === username && pass === password) {
        authenticated = true;
        output.innerHTML += '<div>Access granted. Type "help" for a list of commands.</div>';
    } else {
        output.innerHTML += '<div>Access denied. Incorrect username or password.</div>';
    }
}

function handleCommand(command) {
    switch (command.toLowerCase()) {
        case 'help':
            output.innerHTML += '<div>Available commands: help, schedule, homework, grades, exit</div>';
            break;
        case 'schedule':
            output.innerHTML += '<div>Your schedule: Math, Science, English, History</div>';
            break;
        case 'homework':
            output.innerHTML += '<div>Homework: Math - Page 45, Science - Lab Report</div>';
            break;
        case 'grades':
            output.innerHTML += '<div>Your grades: Math - A, Science - B, English - A, History - B+</div>';
            break;
        case 'exit':
            authenticated = false;
            output.innerHTML += '<div>Logged out. Enter username and password to continue.</div>';
            break;
        default:
            output.innerHTML += `<div>Unknown command: ${command}</div>`;
    }
}
