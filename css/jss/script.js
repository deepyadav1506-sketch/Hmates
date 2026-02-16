/* ===============================
   HMates - Smart Hostel Booking
   Complete JavaScript File
================================= */


/* -------- 1️⃣ Booking Form Validation -------- */

function bookHostel() {
    let nameField = document.getElementById("name");
    let phoneField = document.getElementById("phone");

    if (!nameField || !phoneField) return true;

    let name = nameField.value.trim();
    let phone = phoneField.value.trim();

    if (name === "" || phone === "") {
        alert("Please fill all details");
        return false;
    }

    alert("Booking Request Submitted Successfully!\nThank you for choosing HMates.");
    return true;
}


/* -------- 2️⃣ Dynamic Price Update -------- */

function updatePrice() {

    let hostelField = document.getElementById("hostel");
    let roomField = document.getElementById("room");
    let priceField = document.getElementById("price");

    if (!hostelField || !roomField || !priceField) return;

    let hostel = hostelField.value;
    let room = roomField.value;
    let price = 0;

    if (hostel === "HMates Boys Hostel") {
        if (room === "Single") price = 6000;
        if (room === "Double") price = 5000;
        if (room === "Dorm") price = 4000;
    }

    if (hostel === "HMates Girls Hostel") {
        if (room === "Single") price = 5800;
        if (room === "Double") price = 4800;
        if (room === "Dorm") price = 3800;
    }

    if (hostel === "HMates Premium Hostel") {
        if (room === "Single") price = 8500;
        if (room === "Double") price = 7000;
    }

    priceField.innerText = price;
}


/* -------- 3️⃣ Hostel Filter -------- */


function filterHostel(type) {

    let cards = document.querySelectorAll(".card");
    if (!cards.length) return;

    cards.forEach(card => {

        if (type === "all") {
            card.style.display = "block";
        } 
        else if (card.classList.contains(type)) {
            card.style.display = "block";
        } 
        else {
            card.style.display = "none";
        }

    });
}


/* -------- 4️⃣ Loader Handling (Safe Version) -------- */

window.addEventListener("load", function () {

    let loader = document.getElementById("loader");

    if (loader) {
        setTimeout(() => {
            loader.style.display = "none";
        }, 800);
    }

});
/* -------- Animated Counter -------- */

function startCounter() {

    let counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {

        let target = +counter.getAttribute("data-target");
        let count = 0;
        let increment = target / 100;

        function updateCount() {

            count += increment;

            if (count < target) {
                counter.innerText = Math.floor(count);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target + "+";
            }
        }

        updateCount();
    });
}

window.addEventListener("load", function () {
    startCounter();
});
function loginUser() {

    let role = document.getElementById("role").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Demo credentials

    if (role === "customer") {
        if (email === "student@hmates.com" && password === "1234") {
            alert("Customer Login Successful!");
            window.location.href = "index.html";
            return false;
        } else {
            alert("Invalid Customer Credentials");
            return false;
        }
    }

    if (role === "owner") {
        if (email === "owner@hmates.com" && password === "1234") {
            alert("Hostel Owner Login Successful!");
            window.location.href = "hostels.html";
            return false;
        } else {
            alert("Invalid Owner Credentials");
            return false;
        }
    }

}

function addHostel() {

    let name = document.getElementById("hostelName").value;
    let location = document.getElementById("location").value;
    let price = document.getElementById("price").value;

    let hostelList = document.getElementById("hostelList");

    let newHostel = document.createElement("div");
    newHostel.classList.add("card");

    newHostel.innerHTML = `
        <h3>${name}</h3>
        <p>Location: ${location}</p>
        <p>₹${price} / month</p>
    `;

    hostelList.appendChild(newHostel);

    alert("Hostel Added Successfully!");

    return false;
}
window.location.href = "owner-dashboard.html";
