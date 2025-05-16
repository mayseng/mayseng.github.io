// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC3NzI9YQuX1auwT0Wsmis9qAC1M_LdhHI",
  authDomain: "secretministrationcom.firebaseapp.com",
  databaseURL: "https://secretministrationcom-default-rtdb.firebaseio.com",
  projectId: "secretministrationcom",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
