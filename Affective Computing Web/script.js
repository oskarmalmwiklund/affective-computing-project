/* opens and closes the subscribe popup */

function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

/* opens and closes the quit experiment popup */

function openPopupQuit() {
    document.getElementById("popupQuit").style.display = "block";
}

 function closePopupQuit() {
    document.getElementById("popupQuit").style.display = "none";
}

/* used on Continue2 to calculcate prices */

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

/* continue button */
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

/* mobile menu */
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




  