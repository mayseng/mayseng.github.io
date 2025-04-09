// script.js
const output = document.getElementById('output');
const input = document.getElementById('input');
const username = "admin"; // Set your username here
const password = "password123"; // Set your password here
let authenticated = false;

// Initial login prompt
output.innerHTML += '<div>Please enter your username and password to continue.</div>';

input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const command = input.value.trim();
        input.value = '';

        if (!authenticated) {
            handleLogin(command);
        } else {
            handleCommand(command);
        }

        // Scroll to the bottom of the output
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
           
