/* This function checks and sets up the camera */
function startVideo() {
  if (navigator.mediaDevices && 
      navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
      .then(handleUserMediaSuccess)
      .catch(handleUserMediaError);
  }
}

function handleUserMediaError(error){
  console.log(error);
}

function handleUserMediaSuccess(stream){
  var video = document.getElementById("myVideo");
  video.srcObject = stream;
  // video.play();
  console.log("success");
  window.setInterval(captureImageFromVideo, 2000);
}

// The variable that holds the detected face information, which will be updated through Firebase callbacks
var detection = null;

function captureImageFromVideo() {
  const canvas = document.getElementById("mainCanvas");
  const context = canvas.getContext("2d");
  
  const video = document.getElementById("myVideo");
  canvas.setAttribute("width", video.width);
  canvas.setAttribute("height", video.height);  
  // Draw video image onto Canvas
  context.drawImage(video, 0, 0, video.width, video.height);

  sendSnapshot();
  
  //var dataObj = context.getImageData(0, 0, canvas.width, canvas.height);

  // If a face detection has been received from the database, draw a rectangle around it on Canvas
  if (detection) {
    const face = detection[0];
    context.beginPath();
    context.moveTo(face.x, face.y);
    context.lineTo(face.x + face.w, face.y);
    context.lineTo(face.x + face.w, face.y + face.h);
    context.lineTo(face.x, face.y + face.h);
    context.lineTo(face.x, face.y);
    context.lineWidth = 5;
    context.strokeStyle = "#0F0";
    context.fillStyle = "#0F0";
    context.stroke();
  }
}
  
function sendSnapshot() {
  const canvas = document.getElementById("mainCanvas");
  // Convert the image into a a URL string with built0-in canvas function 
  const data = canvas.toDataURL();
  const commaIndex = data.indexOf(",");
  const imgString = data.substring(commaIndex+1,data.length);
  storeImage(imgString);
}

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAFlE1-z280atVYvoCdirQwBjolPDjksBA",
  authDomain: "affective-computing-proj-48220.firebaseapp.com",
  projectId: "affective-computing-proj-48220",
  databaseURL: "https://affective-computing-proj-48220.firebaseio.com",
  storageBucket: "affective-computing-proj-48220.appspot.com",
  messagingSenderId: "1084466855468",
  appId: "1:1084466855468:web:7e25dcbd77af8a8c52db89",
  measurementId: "G-363YKWWSE7"
};
firebase.initializeApp(config);

function storeImage(imgContent)
{
    var dbRef = firebase.database().ref('/');
    dbRef.update({"image":imgContent});
}

// Register a callback for when a detection is updated in the database
var dbRef = firebase.database().ref('/detection/');
dbRef.on("value", newFaceDetected);

function newFaceDetected(snapshot) {
  detection = snapshot.val();
}