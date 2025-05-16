// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC3NzI9YQuX1auwT0Wsmis9qAC1M_LdhHI",
  authDomain: "secretministrationcom.firebaseapp.com",
  databaseURL: "https://secretministrationcom.firebaseio.com",
  projectId: "secretministrationcom",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Signup function
function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert('Signup successful! Redirecting to chatroom...');
      window.location.href = 'chatroom.html';
    })
    .catch(error => alert(error.message));
}

// Login function
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert('Login successful! Redirecting to chatroom...');
      window.location.href = 'chatroom.html';
    })
    .catch(error => alert(error.message));
}

// Logout function (used in chatroom)
function logout() {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
}
