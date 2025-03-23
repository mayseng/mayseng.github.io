// script.js

// Simple Caesar cipher encryption
function caesarCipher(str, shift) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        let isLower = char === char.toLowerCase();

        // Find index in alphabet
        let idx = alphabet.indexOf(char);

        // If character is in alphabet
        if (idx !== -1) {
            let newIdx = (idx + shift) % alphabet.length;
            if (newIdx < 0) newIdx += alphabet.length;
            result += alphabet[newIdx];
        } else {
            result += char;  // Non-alphabetic characters are not changed
        }
    }
    return result;
}

// Decrypt with the opposite shift
function caesarDecipher(str, shift) {
    return caesarCipher(str, -shift);
}

// Handle form submission
document.getElementById('messageForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const message = document.getElementById('message').value;
    const password = document.getElementById('password').value;

    // Create a shift value based on the password length
    const shift = password.length;

    // Encrypt the message
    const encryptedMessage = caesarCipher(message, shift);
    document.getElementById('encryptedMessage').textContent = encryptedMessage;

    // Decrypt the message
    const decryptedMessage = caesarDecipher(encryptedMessage, shift);
    document.getElementById('decryptedMessage').textContent = decryptedMessage;
});
