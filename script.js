// script.js

// Audio elements for sound effects
const whooshSound = document.getElementById('whoosh');
const chimeSound = document.getElementById('chime');

// Store previous messages in localStorage
let messageHistory = JSON.parse(localStorage.getItem('messageHistory')) || [];

function playSound(sound) {
    sound.play();
}

// Vigenère cipher encryption
function vigenereCipher(str, password) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    let passwordIndex = 0;

    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        let idx = alphabet.indexOf(char);
        if (idx === -1) {
            result += char;
        } else {
            let shift = alphabet.indexOf(password[passwordIndex % password.length]);
            let newIdx = (idx + shift) % alphabet.length;
            result += alphabet[newIdx];
            passwordIndex++;
        }
    }
    return result;
}

// Caesar cipher encryption
function caesarCipher(str, shift) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        let idx = alphabet.indexOf(char);
        if (idx === -1) {
            result += char;
        } else {
            let newIdx = (idx + shift) % alphabet.length;
            result += alphabet[newIdx];
        }
    }
    return result;
}

// XOR cipher encryption
function xorCipher(str, password) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        result += String.fromCharCode(char.charCodeAt(0) ^ password.charCodeAt(i % password.length));
    }
    return result;
}

// Decryption function
function decryptMessage(encryptedMessage, password, cipherType) {
    switch (cipherType) {
        case 'vigenere':
            return vigenereCipher(encryptedMessage, password); // reverse of encryption
        case 'caesar':
            return caesarCipher(encryptedMessage, -password.length); // reverse shift
        case 'xor':
            return xorCipher(encryptedMessage, password); // same method for decryption
        default:
            return '';
    }
}

// Handle form submission
document.getElementById('messageForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const message = document.getElementById('message').value;
    const password = document.getElementById('password').value;
    const cipherType = document.getElementById('cipher').value;

    // Check for empty fields
    if (message.trim() === "" || password.trim() === "") {
        alert("Please fill in both the message and password.");
        return;
    }

    let encryptedMessage;

    switch (cipherType) {
        case 'vigenere':
            encryptedMessage = vigenereCipher(message, password);
            break;
        case 'caesar':
            encryptedMessage = caesarCipher(message, password.length);
            break;
        case 'xor':
            encryptedMessage = xorCipher(message, password);
            break;
        default:
            encryptedMessage = message;
    }

    const decryptedMessage = decryptMessage(encryptedMessage, password, cipherType);

    // Update encrypted and decrypted messages in the UI
    document.getElementById('encryptedMessage').textContent = encryptedMessage;
    document.getElementById('decryptedMessage').textContent = decryptedMessage;

    // Save to message history
    const newMessage = {
        encrypted: encryptedMessage,
        decrypted: decryptedMessage,
        cipher: cipherType,
    };

    messageHistory.push(newMessage);
    localStorage.setItem('messageHistory', JSON.stringify(messageHistory));

    // Play sound effects
    playSound(whooshSound);
    playSound(chimeSound);

    // Show the output and update history display
    document.getElementById('output').classList.remove('hidden');
    displayMessageHistory();
});

// Function to display the message history
function displayMessageHistory() {
    const historyContainer = document.getElementById('messageHistory');
    historyContainer.innerHTML = '';

    if (messageHistory.length === 0) {
        historyContainer.innerHTML = '<p>No messages yet...</p>';
        return;
    }

    messageHistory.forEach((msg, index) => {
        const historyItem = document.createElement('p');
        historyItem.textContent = `Message ${index + 1}: ${msg.encrypted}`;
        historyItem.addEventListener('click', () => {
            alert(`Decrypted Message: ${msg.decrypted}`);
        });
        historyContainer.appendChild(historyItem);
    });
}

// Display the history on initial load
displayMessageHistory();
