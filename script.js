// Your Firebase config (replace this with your real config from Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyC3NzI9YQuX1auwT0Wsmis9qAC1M_LdhHI",
  authDomain: "secretministrationcom.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "secretministrationcom",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const messagesRef = db.ref("messages");

// Send message function
function sendMessage() {
  const user = document.getElementById('username').value;
  const message = document.getElementById('message').value;
  if (user && message) {
    messagesRef.push({
      user: user,
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
});
