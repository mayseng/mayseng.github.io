import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

export function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-message');
  errorMsg.textContent = '';

  if (!email || !password) {
    errorMsg.textContent = 'Please enter both email and password.';
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = '../chatroom/';
    })
    .catch(error => {
      errorMsg.textContent = error.message;
    });
}

export function login() {
  // same pattern as signup
}

export function logout() {
  signOut(auth).then(() => {
    window.location.href = '../';
  });
}
