// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC3NzI9YQuX1auwT0Wsmis9qAC1M_LdhHI",
  authDomain: "secretministrationcom.firebaseapp.com",
  databaseURL: "https://secretministrationcom.firebaseio.com",
  projectId: "secretministrationcom",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const messagesRef = db.ref("messages");

// Check if user is logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'login.html';
  }
});

// Send message
function sendMessage() {
  const user = auth.currentUser;
  const message = document.getElementById('message').value;
  if (message && user) {
    messagesRef.push({
      user: user.email,
      message: message,
      timestamp: Date.now()
    });
    document.getElementById('message').value = '';
  }
}

// Listen for new messages
messagesRef.on('child_added', (snapshot) => {
  const msg = snapshot.val();
  const msgDiv = document.createElement('div');
  msgDiv.textContent = msg.user + ": " + msg.message;
  document.getElementById('chat-box').appendChild(msgDiv);
  document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
});
