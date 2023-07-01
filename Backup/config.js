//Firebase configuration for app and storage
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage, ref, uploadString } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFlE1-z280atVYvoCdirQwBjolPDjksBA",
  authDomain: "affective-computing-proj-48220.firebaseapp.com",
  databaseURL: "https://affective-computing-proj-48220-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "affective-computing-proj-48220",
  storageBucket: "affective-computing-proj-48220.appspot.com",
  messagingSenderId: "1084466855468",
  appId: "1:1084466855468:web:7e25dcbd77af8a8c52db89",
  measurementId: "G-363YKWWSE7"
};

// Initialize firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);