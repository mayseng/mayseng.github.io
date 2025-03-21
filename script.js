const socket = io();

const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const chatDiv = document.getElementById('chat');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

loginButton.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            chatDiv.style.display = 'block';
            document.getElementById('login').style.display = 'none';
        } else {
            alert('Login failed');
        }
    });
});

registerButton.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            alert('Registration successful');
        } else {
            alert('Registration failed');
        }
    });
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        socket.emit('newMessage', message);
        messageInput.value = '';
    }
});

socket.on('message', (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
});
