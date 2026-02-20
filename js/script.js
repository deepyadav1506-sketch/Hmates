/* =========================================
   HMates - Master Logic Engine (2026)
   ========================================= */

// 1. Database Connection Initialization
// Ensure Firebase is initialized in your HTML before this file
const database = firebase.database();

// Page load par detect karein ki kaunsa function chalana hai
window.onload = function() {
    console.log("HMates Engine: Connected & Ready.");
    
    // Page Detection Logic
    if (document.querySelector(".cards-container")) {
        loadHostels(); // Hostels Page cards load karein
    }
    if (document.getElementById("hostel")) {
        syncDropdown(); // Booking Page dropdown load karein
    }
    if (document.getElementById("booking-container")) {
        renderOwnerPanel(); // Owner Dashboard bookings load karein
    }
};

// --- SECTION 1: LOGIN & ACCESS ---
function loginUser() {
    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Demo Credentials for JECRC/Poornima Students
    if (role === "customer" && email === "student@hmates.com" && password === "1234") {
        alert("Welcome Student! Redirecting to Home...");
        window.location.href = "index.html";
        return false;
    } 
    else if (role === "owner" && email === "owner@hmates.com" && password === "1234") {
        alert("Owner Access Granted!");
        window.location.href = "owner-dashboard.html";
        return false;
    }
    alert("Invalid Credentials. Please try again.");
    return false;
}

// --- SECTION 2: HOSTEL LISTING (OWNER SIDE) ---
function saveHostelData() {
    // Add this in saveHostelData function
const newHostel = {
    name: document.getElementById("hName").value,
    location: document.getElementById("hLocation").value,
    institution: document.getElementById("hInstitution").value, // Naya Field
    type: document.getElementById("hType").value,
    basePrice: parseInt(document.getElementById("basePrice").value),
    // ... baaki data
};
    const hostelObj = {
        name: document.getElementById("hName").value,
        location: document.getElementById("hLocation").value,
        institution: document.getElementById("hInstitution").value,
        type: document.getElementById("hType").value,
        basePrice: parseInt(document.getElementById("basePrice").value),
        doubleDiscount: parseInt(document.getElementById("doubleDisc").value) || 0,
        acExtra: parseInt(document.getElementById("acExtra").value) || 0,
        image: "css/hostal.jpg", // Default placeholder
        timestamp: Date.now()
    };

    if (!hostelObj.name || !hostelObj.basePrice) {
        alert("Please fill name and base price.");
        return false;
    }

    // Firebase Cloud par save karein
    database.ref('hostels').push(hostelObj)
        .then(() => {
            alert("✅ Hostel successfully listed on HMates!");
            window.location.href = "hostels.html";
        })
        .catch(err => alert("Cloud Sync Error: " + err.message));

    return false;
}

// --- SECTION 3: DISPLAY ENGINE (STUDENT SIDE) ---
function loadHostels() {
    const container = document.querySelector(".cards-container");
    
    database.ref('hostels').on('value', (snapshot) => {
        const data = snapshot.val();
        container.innerHTML = ""; // Purana static content clear karein

        if (data) {
            for (let id in data) {
                const h = data[id];
                container.innerHTML += `
                    <div class="card ${h.type}">
                        <div class="badge">${h.type.toUpperCase()}</div>
                        <img src="${h.image}" alt="Hostel">
                        <div class="card-info">
                            <h3>${h.name}</h3>
                            <p><i class="fas fa-map-marker-alt"></i> ${h.location}</p>
                            <div class="card-footer">
                                <span class="price">₹${h.basePrice}/mo</span>
                                <a href="booking.html" class="btn-sm">Book Now</a>
                            </div>
                        </div>
                    </div>`;
            }
        }
    });
}

// --- SECTION 4: BOOKING & PRICE CALCULATION ---
function syncDropdown() {
    const select = document.getElementById("hostel");
    database.ref('hostels').on('value', (snapshot) => {
        const data = snapshot.val();
        select.innerHTML = '<option value="">-- Choose Hostel --</option>';
        for (let id in data) {
            let opt = document.createElement("option");
            opt.value = data[id].name;
            opt.innerText = data[id].name;
            select.appendChild(opt);
        }
    });
}

function updatePrice() {
    const selectedHostel = document.getElementById("hostel").value;
    const room = document.getElementById("room").value;
    const category = document.getElementById("roomCategory").value;

    database.ref('hostels').once('value', (snapshot) => {
        const data = snapshot.val();
        let currentH = Object.values(data).find(h => h.name === selectedHostel);

        if (currentH) {
            let base = currentH.basePrice;
            let roomAdj = (room === "Double") ? -currentH.doubleDiscount : 0;
            let acAdj = (category === "ac") ? currentH.acExtra : 0;

            // UI Update with new CSS IDs
            document.getElementById("base-price").innerText = "₹" + base;
            document.getElementById("room-extra").innerText = (roomAdj >= 0 ? "+ ₹" : "- ₹") + Math.abs(roomAdj);
            document.getElementById("ac-category").innerText = "+ ₹" + acAdj;
            document.getElementById("price").innerText = "₹" + (base + roomAdj + acAdj);
        }
    });
}

function bookHostel() {
    const bookingData = {
        studentName: document.getElementById("name").value,
        studentPhone: document.getElementById("phone").value,
        hostel: document.getElementById("hostel").value,
        finalPrice: document.getElementById("price").innerText,
        bookingDate: new Date().toLocaleString()
    };

    database.ref('bookings').push(bookingData)
        .then(() => {
            alert(`Thank you ${bookingData.studentName}! Request sent to Owner.`);
            window.location.href = "index.html";
        });
    return false;
}

// --- SECTION 5: OWNER DASHBOARD ADMIN ---
function renderOwnerPanel() {
    const container = document.getElementById("booking-container");
    database.ref('bookings').on('value', (snapshot) => {
        const data = snapshot.val();
        container.innerHTML = "";
        
        if (!data) {
            container.innerHTML = "<p>No booking requests yet.</p>";
            return;
        }

        for (let id in data) {
            const b = data[id];
            container.innerHTML += `
                <div class="booking-row" style="background:#fff; padding:15px; margin-bottom:10px; border-radius:8px; border-left:5px solid #ff690f;">
                    <h4>${b.studentName} (${b.studentPhone})</h4>
                    <p>Wants to book: <b>${b.hostel}</b></p>
                    <p>Agreed Price: ${b.finalPrice}</p>
                    <button onclick="clearBooking('${id}')" class="btn-sm" style="background:red; border:none; cursor:pointer;">Delete</button>
                </div>`;
        }
    });
}

function clearBooking(id) {
    if (confirm("Mark as Handled?")) {
        database.ref('bookings/' + id).remove();
    }
}
// Contact Form Submission 
const contactForm = document.getElementById('frontendContactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const messageData = {
            name: document.getElementById('cName').value,
            email: document.getElementById('cEmail').value,
            message: document.getElementById('cMessage').value,
            date: new Date().toLocaleString()
        };

        // Local Storage mein save karna
        let existingMessages = JSON.parse(localStorage.getItem('hmates_messages')) || [];
        existingMessages.push(messageData);
        localStorage.setItem('hmates_messages', JSON.stringify(existingMessages));

        alert("Thank you " + messageData.name + "! Your message has been saved locally.");
        contactForm.reset();
    });
}
// Register Function (Frontend Only)
function handleRegistration() {
    const userObj = {
        role: document.getElementById('regRole').value,
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        orgName: document.getElementById('regOrgName').value,
        phone: document.getElementById('regPhone').value,
        pass: document.getElementById('regPass').value
    };

    // Pehle se saved users ko nikaalein
    let users = JSON.parse(localStorage.getItem('hmates_users')) || [];
    
    // Check if email already exists
    if(users.some(u => u.email === userObj.email)) {
        alert("This email is already registered!");
        return false;
    }

    // Naya user add karein
    users.push(userObj);
    localStorage.setItem('hmates_users', JSON.stringify(users));

    alert("Registration Successful! Now you can Login.");
    window.location.href = "login.html";
    return false;
}

// Field placeholder toggle based on role
function toggleRegFields() {
    const role = document.getElementById('regRole').value;
    const orgInput = document.getElementById('regOrgName');
    
    if(role === 'institution') {
        orgInput.placeholder = "University / School Name";
    } else {
        orgInput.placeholder = "Hostel / PG Name";
    }
}
// --- Security Check Function ---
function checkAuth() {
    const loggedInUser = localStorage.getItem('hmates_loggedInUser');
    const currentPage = window.location.pathname;

    // Agar user logged in nahi hai aur booking page par jane ki koshish kar raha hai
    if (!loggedInUser && currentPage.includes("booking.html")) {
        alert("🔒 Safety First! Please Login or Register to book a hostel.");
        window.location.href = "login.html";
    }
}

// Har page load par check karein
window.addEventListener('DOMContentLoaded', checkAuth);

// --- Login Function (Updated) ---
function loginUser() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const users = JSON.parse(localStorage.getItem('hmates_users')) || [];

    const validUser = users.find(u => u.email === email && u.pass === pass);

    if (validUser) {
        // User ki info session mein save karein
        localStorage.setItem('hmates_loggedInUser', JSON.stringify(validUser));
        alert("Login Successful! Welcome to HMates.");
        
        // Login ke baad wapis explore page par bhejein
        window.location.href = "hostels.html";
    } else {
        alert("Invalid Email or Password!");
    }
    return false;
}
// Toggle fields based on role
function toggleRegFields() {
    const role = document.getElementById('regRole').value;
    const orgInput = document.getElementById('regOrgName');
    const orgIcon = document.querySelector('#orgNameGroup i');

    if (role === 'customer') {
        orgInput.placeholder = "Your College / School Name";
        orgIcon.className = "fas fa-university input-icon";
    } else if (role === 'owner') {
        orgInput.placeholder = "Hostel / PG Name";
        orgIcon.className = "fas fa-hotel input-icon";
    } else {
        orgInput.placeholder = "Institution Full Name";
        orgIcon.className = "fas fa-school input-icon";
    }
}

// Global Register Handler
function handleRegistration() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const role = document.getElementById('regRole').value;
    const pass = document.getElementById('regPass').value;

    const newUser = { name, email, phone, role, pass, date: new Date().toLocaleDateString() };

    let users = JSON.parse(localStorage.getItem('hmates_users')) || [];
    
    // Email Check
    if(users.some(u => u.email === email)) {
        alert("Email already exists! Please Login.");
        return false;
    }

    users.push(newUser);
    localStorage.setItem('hmates_users', JSON.stringify(users));

    alert("Registration Successful! Please login to continue.");
    window.location.href = "login.html";
    return false;
}
function updateNav() {
    const user = JSON.parse(localStorage.getItem('hmates_loggedInUser'));
    const nav = document.querySelector(".nav-links");

    if (user) {
        // Login button ko user ke naam se badal dein
        const loginBtn = document.querySelector(".login-btn");
        if(loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> Hi, ${user.name.split(' ')[0]}`;
            loginBtn.href = "#"; // Profile page later
        }
    }
}
window.addEventListener('DOMContentLoaded', updateNav);
// Har page load par check karein ki kaun logged in hai
window.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('hmates_loggedInUser'));
    const navLinks = document.querySelector('.nav-links');

    if (loggedInUser) {
        // Purana Login button hatayein
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) loginBtn.remove();

        // 1. Agar OWNER login hai toh "List Hostel" dikhao
        if (loggedInUser.role === 'owner') {
            const ownerLink = document.createElement('a');
            ownerLink.href = 'owner-dashboard.html';
            ownerLink.innerHTML = '<i class="fas fa-plus-circle"></i> List Your Hostel';
            ownerLink.style.color = 'var(--accent-color)';
            ownerLink.style.fontWeight = 'bold';
            navLinks.appendChild(ownerLink);
        }

        // 2. Student aur Owner dono ke liye "User Name" aur "Logout" dikhao
        const userGreet = document.createElement('span');
        userGreet.innerHTML = `<i class="fas fa-user-circle"></i> Hi, ${loggedInUser.name.split(' ')[0]}`;
        userGreet.style.marginLeft = "15px";
        
        const logoutBtn = document.createElement('a');
        logoutBtn.href = "#";
        logoutBtn.innerText = "Logout";
        logoutBtn.onclick = logout; // Logout function niche hai
        logoutBtn.style.color = "red";

        navLinks.appendChild(userGreet);
        navLinks.appendChild(logoutBtn);
    }
});

function logout() {
    localStorage.removeItem('hmates_loggedInUser');
    alert("Logged out successfully!");
    window.location.href = "index.html";
}
// Ye code sirf owner-dashboard.html ke liye hai
function checkOwnerAuthority() {
    const user = JSON.parse(localStorage.getItem('hmates_loggedInUser'));
    
    if (!user || user.role !== 'owner') {
        alert("🚫 Access Denied! Only Hostel Owners can list properties.");
        window.location.href = "index.html";
    }
}

if (window.location.pathname.includes("owner-dashboard.html")) {
    checkOwnerAuthority();
}

function checkBookingAuthority() {
    const user = JSON.parse(localStorage.getItem('hmates_loggedInUser'));
    
    if (!user) {
        alert("Pehle Register ya Login karein tabhi aap booking request bhej sakte hain.");
        window.location.href = "login.html";
    }
}
// renderWelcomeBanner
function renderWelcomeBanner() {
    const loggedInUser = JSON.parse(localStorage.getItem('hmates_loggedInUser'));
    const welcomeText = document.getElementById('welcome-text');
    const welcomeSubtext = document.getElementById('welcome-subtext');
    const userActions = document.getElementById('user-actions');

    if (loggedInUser) {
        // 1. Naam bada dikhao (First name only for friendly feel)
        const firstName = loggedInUser.name.split(' ')[0];
        welcomeText.innerHTML = `Welcome back, <span style="color:var(--accent-color)">${firstName}!</span>`;
        
        // 2. Role ke hisab se message badlo
        if (loggedInUser.role === 'owner') {
            welcomeSubtext.innerText = "Manage your hostel listings and view new requests below.";
            userActions.innerHTML = `<a href="owner-dashboard.html" class="btn-sm">Go to Dashboard</a>`;
        } else {
            welcomeSubtext.innerText = "Ready to find your next stay? Explore our verified hostels.";
            userActions.innerHTML = `<a href="hostels.html" class="btn-sm">Explore Hostels</a>`;
        }
    }
}

// Page load hote hi ise chalayein
window.addEventListener('DOMContentLoaded', renderWelcomeBanner);

//loadMyListings function jo owner ke listings ko display karega
function loadMyListings() {
    const loggedInUser = JSON.parse(localStorage.getItem('hmates_loggedInUser'));
    const container = document.getElementById('my-listings-body');
    const allHostels = JSON.parse(localStorage.getItem('hmates_hostels')) || [];

    // Filter hostels: Maan lijiye hum owner ke email ya name se track kar rahe hain
    // Abhi ke liye hum saari listings dikha rahe hain (Owner specificity baad mein add kar sakte hain)
    container.innerHTML = "";

    if (allHostels.length === 0) {
        container.innerHTML = "<tr><td colspan='4'>No hostels listed yet.</td></tr>";
        return;
    }

    allHostels.forEach((h, index) => {
        container.innerHTML += `
            <tr>
                <td><strong>${h.name}</strong></td>
                <td>${h.location}</td>
                <td>₹${h.basePrice}</td>
                <td>
                    <button onclick="deleteHostel(${index})" class="btn-delete"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

// Hostel delete karne ka option
function deleteHostel(index) {
    if (confirm("Are you sure you want to remove this listing?")) {
        let allHostels = JSON.parse(localStorage.getItem('hmates_hostels'));
        allHostels.splice(index, 1);
        localStorage.setItem('hmates_hostels', JSON.stringify(allHostels));
        loadMyListings(); // Refresh table
        alert("Listing removed successfully!");
    }
}

// Section switch karne ka logic
function showSection(sectionId) {
    document.getElementById('booking-requests').style.display = (sectionId === 'bookings') ? 'block' : 'none';
    document.getElementById('my-listings-section').style.display = (sectionId === 'my-listings') ? 'block' : 'none';
    
    if(sectionId === 'my-listings') loadMyListings();
}
let currentGenderFilter = 'all';

function filterByGender(gender) {
    currentGenderFilter = gender;
    
    // UI active state
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    filterHostels(); // Run combined filter
}

function filterHostels() {
    const searchTerm = document.getElementById('hostelSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    let foundCount = 0;

    cards.forEach(card => {
        const hName = card.querySelector('h3').innerText.toLowerCase();
        const hLocation = card.querySelector('p').innerText.toLowerCase();
        const isGenderMatch = (currentGenderFilter === 'all' || card.classList.contains(currentGenderFilter));
        
        // Search in Name, Location, or Institution text
        const isSearchMatch = hName.includes(searchTerm) || hLocation.includes(searchTerm);

        if (isGenderMatch && isSearchMatch) {
            card.style.display = "block";
            foundCount++;
        } else {
            card.style.display = "none";
        }
    });

    // Show/Hide No Results message
    document.getElementById('no-results').style.display = (foundCount === 0) ? "block" : "none";
}
function filterHostelsByRole(role) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (role === 'all') {
            card.style.display = 'block';
        } else {
            // Check if card has the class (boys, girls, or premium)
            if (card.classList.contains(role)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}
// Function to show loading on button
function setSubmitting(buttonId, isSubmitting) {
    const btn = document.getElementById(buttonId);
    if (isSubmitting) {
        btn.disabled = true;
        btn.innerHTML = `Processing... <div class="spinner"></div>`;
    } else {
        btn.disabled = false;
        // Wapis purana text (Aap apne hisab se change kar sakte hain)
        btn.innerHTML = buttonId === 'loginBtn' ? 'Login to Dashboard' : 'Create Account';
    }
}

// Updated Registration with Validation
function handleRegistration() {
    const phone = document.getElementById('regPhone').value;
    const pass = document.getElementById('regPass').value;
    
    // 1. Basic Validation
    if (phone.length !== 10) {
        alert("Bhai, mobile number pure 10 digit ka dalo!");
        return false;
    }
    if (pass.length < 6) {
        alert("Password thoda lamba rakho (kam se kam 6 characters)!");
        return false;
    }

    // 2. Show Loading
    setSubmitting('regBtn', true);

    // Fake delay (Simulation) - Baad mein yahan aapka dost API call lagayega
    setTimeout(() => {
        // Purana registration logic yahan aayega...
        // Success hone par:
        setSubmitting('regBtn', false);
        alert("Registration Successful!");
        window.location.href = "login.html";
    }, 1500);

    return false;
}