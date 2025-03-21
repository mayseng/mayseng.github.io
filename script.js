// script.js
document.getElementById('setName').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('username', username);
        alert(`Welcome, ${username}!`);
        document.getElementById('username').style.display = 'none';
        document.getElementById('setName').style.display = 'none';
    } else {
        alert('Please enter a name.');
    }
});

document.getElementById('sendMessage').addEventListener('click', function() {
    const messageInput = document.getElementById('messageInput');
    const messagesDiv = document.getElementById('messages');
    const username = localStorage.getItem('username') || 'Anonymous';

    if (messageInput.value) {
        const message = document.createElement('div');
        message.textContent = `${username}: ${messageInput.value}`;
        messagesDiv.appendChild(message);
        messageInput.value = '';
    } else {
        alert('Please enter a message.');
    }
});
