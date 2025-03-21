document.getElementById('send').addEventListener('click', function() {
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const messagesDiv = document.getElementById('messages');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (name && message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${name}: ${message}`;
        messagesDiv.appendChild(messageElement);
        messageInput.value = '';
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
    } else {
        alert('Please enter both your name and a message.');
    }
});
