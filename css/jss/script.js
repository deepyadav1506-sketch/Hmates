/* =========================================
   HMates - Logic & Interactivity (2026)
   ========================================= */
   // 1. Ye HMates ka permanent data hai

// 1️⃣ Dynamic Price Update (Booking Page)

function updatePrice() {
    let selectedName = document.getElementById("hostel").value;
    let room = document.getElementById("room").value;
    let category = document.getElementById("roomCategory").value;

    // LocalStorage se wo wala hostel dhundo
    let allHostels = JSON.parse(localStorage.getItem("hmates_hostels")) || [];
    let hData = allHostels.find(h => h.name === selectedName);

    if (hData) {
        let base = hData.basePrice;
        let roomAdjust = (room === "Double") ? -hData.doubleDiscount : 0;
        let acAdjust = (category === "ac") ? hData.acExtra : 0;

        // UI Update
        document.getElementById("base-price").innerText = "₹" + base;
        document.getElementById("room-extra").innerText = (roomAdjust >= 0 ? "+ ₹" : "- ₹") + Math.abs(roomAdjust);
        document.getElementById("ac-category").innerText = "+ ₹" + acAdjust;
        document.getElementById("price").innerText = "₹" + (base + roomAdjust + acAdjust);
    }
}

// 2️⃣ Filter Hostels (Hostels Page)
function filterHostel(type) {
    const cards = document.querySelectorAll(".card");
    
    cards.forEach(card => {
        if (type === "all") {
            card.style.display = "block";
        } else if (card.classList.contains(type)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// 3️⃣ Login Logic with Role Redirection
function loginUser() {
    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Demo Credentials
    if (role === "customer") {
        if (email === "student@hmates.com" && password === "1234") {
            alert("Customer Login Successful! Welcome to HMates.");
            window.location.href = "index.html"; // Redirect to Home
            return false;
        }
    } 
    else if (role === "owner") {
        if (email === "owner@hmates.com" && password === "1234") {
            alert("Hostel Owner Login Successful!");
            window.location.href = "owner-dashboard.html"; // Redirect to Dashboard
            return false;
        }
    }
    
    alert("Invalid Credentials! Please try again.");
    return false;
}

// 4️⃣ Add Hostel (Owner Dashboard)
function saveHostelData() {
    let hostelObj = {
        name: document.getElementById("hName").value,
        location: document.getElementById("hLocation").value,
        type: document.getElementById("hType").value,
        basePrice: parseInt(document.getElementById("basePrice").value),
        doubleDiscount: parseInt(document.getElementById("doubleDisc").value) || 0,
        acExtra: parseInt(document.getElementById("acExtra").value) || 0
    };

    // Purana data nikaal kar naya add karein
    let allHostels = JSON.parse(localStorage.getItem("hmates_hostels")) || [];
    allHostels.push(hostelObj);
    localStorage.setItem("hmates_hostels", JSON.stringify(allHostels));

    alert("Hostel successfully listed with your custom prices!");
    return false; // Page refresh na ho

}

// 5️⃣ Booking Submission
function bookHostel() {
    const name = document.getElementById("name").value;
    alert(`Thank you ${name}! Your booking request is sent to the hostel owner.`);
    return true; 
}
// Default HMates Data
const defaultHostels = [
    {
        name: "HMates Boys Hostel",
        location: "Near JECRC University, Jaipur",
        type: "boys",
        basePrice: 6000,
        doubleDiscount: 500,
        acExtra: 1500,
        image: "css/boys.jpg"
    },
    {
        name: "HMates Girls Hostel",
        location: "Near Poornima University, Jaipur",
        type: "girls",
        basePrice: 5500,
        doubleDiscount: 500,
        acExtra: 1500,
        image: "css/girls.jpg"
    },
    {
        name: "HMates Premium Hostel",
        location: "Jagatpura, Jaipur",
        type: "boys",
        basePrice: 8500,
        doubleDiscount: 1000,
        acExtra: 0, // Already AC
        image: "css/premium.jpg"
    }
];

// Page load par check karein
function initializeHostels() {
    let stored = localStorage.getItem("hmates_hostels");
    
    // Agar local storage khali hai, toh HMates add kar do
    if (!stored) {
        localStorage.setItem("hmates_hostels", JSON.stringify(defaultHostels));
    }
}

// Ise sabse pehle call karein
initializeHostels();
window.onload = function() {
    initializeHostels(); // Ensure HMates is there
    const container = document.querySelector(".cards-container");
    const allHostels = JSON.parse(localStorage.getItem("hmates_hostels"));

    container.innerHTML = ""; // Purana static content saaf karein

    allHostels.forEach(h => {
        const card = document.createElement("div");
        card.className = `card ${h.type}`;
        // Agar owner ne image nahi di toh default use karein
        const imgSrc = h.image || "css/hostal.jpg";
        
        card.innerHTML = `
            <img src="${imgSrc}" alt="${h.name}">
            <div class="card-info">
                <h3>${h.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${h.location}</p>
                <div class="card-footer">
                    <span class="price">₹${h.basePrice}/mo</span>
                    <a href="booking.html" class="btn-sm">Book Now</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
};
function loadDynamicHostels() {
    const hostelSelect = document.getElementById("hostel");
    // Local storage se data lein, agar kuch na ho toh khali array
    const allHostels = JSON.parse(localStorage.getItem("hmates_hostels")) || [];

    // Purane options (siway pehle ke) saaf karein
    hostelSelect.innerHTML = '<option value="">-- Choose a Hostel --</option>';

    allHostels.forEach(h => {
        const option = document.createElement("option");
        option.value = h.name; // Yeh wahi name hai jo owner ne list kiya
        option.innerText = h.name;
        hostelSelect.appendChild(option);
    });
}

// Page load hote hi options load karein
window.addEventListener('DOMContentLoaded', loadDynamicHostels);
