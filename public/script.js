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

// opens and closes the subscribe popup

function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// opens and closes the quit experiment popup

function openPopupQuit() {
    document.getElementById("popupQuit").style.display = "block";
}

 function closePopupQuit() {
    document.getElementById("popupQuit").style.display = "none";
}

// used on Continue2 to calculcate prices

function calculatePrice() {
    const q1Options = document.getElementsByName("q1");
    const q2Options = document.getElementsByName("q2");
    let totalPrice = 0;

    for (let i = 0; i < q1Options.length; i++) {
        if (q1Options[i].checked) {
            totalPrice += parseInt(q1Options[i].value);
        }
    }

    for (let i = 0; i < q2Options.length; i++) {
        if (q2Options[i].checked) {
            totalPrice += parseInt(q2Options[i].value);
        }
    }

    document.getElementById("totalPrice").textContent = totalPrice;
}

// continue button
let checkbox = document.querySelector(".checkbox-input");
let button = document.querySelector(".button");
button.disabled = true;
checkbox.addEventListener("change", stateHandle);

function stateHandle() {
    if (document.querySelector(".input").value === "") {
        button.disabled = true;
    } else {
        button.disabled = false;
    }
}

// mobile menu
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}))