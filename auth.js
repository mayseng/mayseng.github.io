import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Exporting the function so you can import and attach it in HTML
export function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert('Signup successful! Redirecting...');
      window.location.href = 'chatroom.html';
    })
    .catch(error => alert(error.message));
}

export function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert('Login successful! Redirecting...');
      window.location.href = 'chatroom.html';
    })
    .catch(error => alert(error.message));
}

export function logout() {
  signOut(auth).then(() => {
    window.location.href = 'index.html';
  });
}
