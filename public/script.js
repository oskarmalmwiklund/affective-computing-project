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

// Declare video and canvas variables
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

// On load, set video height and width, play video and call loop function
video.onloadedmetadata = function () {
  const ratio = video.videoHeight / video.videoWidth;
  const max_width = 640;
  const max_height = max_width * ratio;

  video.width = max_width;
  video.height = max_height;

  canvas.width = max_width;
  canvas.height = max_height;

  video.play();
  loop();
};

// Draws the image on canvas
function snap() {
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

  // Saves the canvas data to data_url format
  const data_url = canvas.toDataURL("image/jpeg");

  // define variables for where to store images
  // saves image with a unique date.now name
  // 'test' needs to be changed to a static user session ID that is unique every time
  const storage_ref_name = `${user}/${Date.now()}.jpeg`;
  const storage_ref = ref(storage, storage_ref_name);

  // uploads data_url encoded string to Cloud Storage
  uploadString(storage_ref, data_url, "data_url")
    .then((snapshot) => {
      console.log(`Uploaded ${storage_ref_name}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

// calls snap, sets timeout and calls itself
function loop() {
  snap();
  setTimeout(loop, 2000);
};

// sets constraints for video stream
navigator.mediaDevices
  .getUserMedia({
    audio: false,
    video: true
  })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.log(err);
  });