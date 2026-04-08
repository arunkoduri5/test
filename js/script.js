// Dynamic Nav
document.addEventListener('DOMContentLoaded', () => {
    injectNav();
    if (window.location.pathname.includes('results.html')) {
        loadResults();
    } else if (window.location.pathname.includes('bookings.html')) {
        loadBookings();
    } else if (window.location.pathname.includes('account.html')) {
        loadAccount();
    } else if (window.location.pathname.includes('equipment.html')) {
        initEquipmentPage();
    }
});

function injectNav() {
    if (window.location.pathname.includes('login.html')) return;
    if (document.querySelector('.nav-injected')) return;

    const path = window.location.pathname;
    const isVehicles = path.includes('index.html') || path === '/' || path.includes('tractor.html') || path.includes('jcb.html') || path.includes('harvester.html') || path.includes('spraying.html') || path.includes('equipment.html') || path.includes('manualspray.html') || path.includes('sugarcane.html') || path.includes('drone.html') || path.includes('results.html');
    const isBookings = path.includes('bookings.html');
    const isAccount = path.includes('account.html');

    const nav = document.createElement('div');
    nav.className = 'nav nav-injected';
    nav.innerHTML = `
        <a href="index.html" class="${isVehicles ? 'active' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Vehicles</span>
        </a>
        <a href="bookings.html" class="${isBookings ? 'active' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14h6"></path><path d="M9 18h6"></path><path d="M12 10h.01"></path></svg>
            <span>Bookings</span>
        </a>
        <a href="account.html" class="${isAccount ? 'active' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Account</span>
        </a>
    `;
    document.body.appendChild(nav);
}

function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement('div');
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function getUserId() {
    return localStorage.getItem("userId");
}

function getMobile() {
    return localStorage.getItem("userMobile");
}

async function login() {
    const mobileField = document.getElementById("mobile");
    const nameField = document.getElementById("name");
    const locationField = document.getElementById("location");
    
    if (!mobileField) return;
    
    const mobile = mobileField.value.trim();
    const name = nameField ? nameField.value.trim() : '';
    const location = locationField ? locationField.value.trim() : '';

    if (!/^\d{10}$/.test(mobile)) {
        showToast("Phone number must be exactly 10 digits");
        return;
    }
    
    if (!name || !location) {
        showToast("Please provide your name and location");
        return;
    }

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile_number: mobile, name: name, location: location })
        });
        const data = await res.json();
        
        if (data.success) {
            localStorage.setItem("loggedin", "true");
            localStorage.setItem("userId", data.user.id);
            localStorage.setItem("userMobile", data.user.mobile_number);
            localStorage.setItem("userName", data.user.name || name);
            localStorage.setItem("userLocation", data.user.location || location);
            
            showToast("Login Successful");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            showToast("Login failed");
        }
    } catch (err) {
        showToast("Error connecting to server");
    }
}

function searchEquipment(type) {
    const dateInput = document.getElementById("date");
    const acresInput = document.getElementById("acres");
    const equipmentTargetInput = document.getElementById("equipmentTarget");

    if (!dateInput || !dateInput.value) {
        showToast("Please select a date");
        return;
    }
    
    const date = dateInput.value;
    const acres = acresInput ? acresInput.value : '';
    const equipmentTarget = equipmentTargetInput ? equipmentTargetInput.value.trim() : '';
    if (type === "equipment" && !equipmentTarget) {
        showToast("Please select equipment target");
        return;
    }

    let url = `results.html?type=${encodeURIComponent(type)}&date=${encodeURIComponent(date)}&acres=${encodeURIComponent(acres)}`;
    if (equipmentTarget) {
        url += `&target=${encodeURIComponent(equipmentTarget)}`;
    }
    window.location.href = url;
}

async function loadResults() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const date = params.get("date");
    const acres = params.get("acres");
    const target = (params.get("target") || "").trim().toLowerCase();

    const list = document.getElementById("machineList");
    if (!list) return;
    list.innerHTML = "<p style='text-align:center;'>Loading matching equipment...</p>";

    try {
        const res = await fetch(`/api/equipment?category=${type}`);
        const equipment = await res.json();

        list.innerHTML = "";

        let filteredEquipment = equipment;
        if (target) {
            filteredEquipment = equipment.filter(machine =>
                (machine.name || "").toLowerCase().includes(target)
            );
        }

        if (filteredEquipment.length === 0) {
            list.innerHTML = "<p style='text-align:center;'>No equipment found.</p>";
            return;
        }

        filteredEquipment.forEach(machine => {
            const div = document.createElement("div");
            div.className = "card";
            div.innerHTML = `
                <div style="flex:1;">
                    <h3>${machine.name}</h3>
                    <p>₹${machine.price_per_hour}/hour</p>
                    <p>${machine.location}</p>
                </div>
                <button style="width: auto; padding: 12px 24px;" onclick="bookMachine(${machine.id}, '${date}', '${acres}')">Book</button>
            `;
            list.appendChild(div);
        });
    } catch (err) {
        list.innerHTML = "<p style='text-align:center; color:red;'>Error loading data</p>";
    }
}

function initEquipmentPage() {
    const bookingForm = document.getElementById("equipmentBookingForm");
    const targetInput = document.getElementById("equipmentTarget");
    const selectedInput = document.getElementById("selectedEquipmentName");

    if (bookingForm) {
        bookingForm.style.display = "none";
    }
    if (targetInput) {
        targetInput.value = "";
    }
    if (selectedInput) {
        selectedInput.value = "";
    }
}

function selectEquipmentTarget(target, cardElement) {
    const targetInput = document.getElementById("equipmentTarget");
    if (!targetInput) return;

    targetInput.value = target;

    document.querySelectorAll("#equipmentTargetCards .equipment-option").forEach(card => {
        card.classList.remove("selected");
    });

    if (cardElement) {
        cardElement.classList.add("selected");
    }
}

function prepareEquipmentBooking(target, buttonElement) {
    const cardElement = buttonElement ? buttonElement.closest(".equipment-option") : null;
    selectEquipmentTarget(target, cardElement);

    const bookingForm = document.getElementById("equipmentBookingForm");
    const selectedInput = document.getElementById("selectedEquipmentName");

    if (selectedInput) {
        selectedInput.value = target;
    }

    if (bookingForm) {
        bookingForm.style.display = "flex";
        bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

async function bookMachine(equipmentId, date, acres) {
    const userId = getUserId();
    if (!userId) {
        showToast("Please log in first");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
        return;
    }

    if (!date || date === 'undefined') {
        showToast("Missing date information");
        return;
    }

    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user_id: userId, 
                equipment_id: equipmentId, 
                acres: acres || 0, 
                required_date: date 
            })
        });
        const data = await res.json();

        if (data.success) {
            showToast("Booking Successful!");
            setTimeout(() => {
                window.location.href = "bookings.html";
            }, 1500);
        } else {
            showToast("Booking failed: " + data.error);
        }
    } catch (err) {
        showToast("Error making booking");
    }
}

async function loadBookings() {
    const container = document.querySelector(".booking");
    if (!container) return;
    
    const userId = getUserId();
    if (!userId) {
        container.innerHTML = "Please log in to view bookings.";
        return;
    }

    container.innerHTML = "<p style='text-align:center;'>Loading bookings...</p>";

    try {
        const res = await fetch(`/api/bookings/${userId}`);
        const bookings = await res.json();

        if (bookings.length > 0) {
            container.innerHTML = "";
            bookings.forEach(b => {
                container.innerHTML += `
                <div style="margin-bottom: 20px;">
                    <p><b>Machine:</b> ${b.machine}</p>
                    <p><b>Mobile:</b> ${getMobile()}</p>
                    <p><b>Date:</b> ${b.required_date}</p>
                    <p><b>Farm Size:</b> ${b.acres || "-"} Acres</p>
                    <p><b>Rate:</b> ₹${b.rate} per hour</p>
                    <p><b>Status:</b> ${b.status}</p>
                    <hr>
                </div>
                `;
            });
        } else {
            container.innerHTML = "<p style='text-align:center;'>No bookings yet.</p>";
        }
    } catch (err) {
        container.innerHTML = "<p style='text-align:center; color:red;'>Error loading bookings.</p>";
    }
}

function logout() {
    localStorage.clear();
    showToast("Logged out successfully");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}

async function loadAccount() {
    const profileDiv = document.getElementById("accountProfile");
    if(!profileDiv) return;

    const mobile = getMobile();
    if(!mobile) {
        profileDiv.innerHTML = "<p style='text-align:center;'>Please log in to view account details.</p>";
        return;
    }

    const userName = localStorage.getItem("userName") || 'Farmer Name';
    const userLocation = localStorage.getItem("userLocation") || 'Unknown Location';

    profileDiv.innerHTML = `<p style="text-align: center;">Loading details...</p>`;

    try {
        const userId = getUserId();
        const res = await fetch(`/api/bookings/${userId}`);
        const bookings = await res.json();
        const total = bookings.length || 0;

        profileDiv.innerHTML = `
            <div style="text-align: center; margin-bottom: 25px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--secondary), #10b981); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-family: 'Poppins', sans-serif; font-weight: 700; margin: 0 auto 15px auto; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); border: 4px solid var(--primary-light);">
                    ${userName.substring(0, 1).toUpperCase() || 'U'}
                </div>
                <h3 style="margin-bottom: 4px; font-size: 22px;">${userName}</h3>
                <p style="font-size: 14px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.5px; margin-bottom: 5px;">Location: ${userLocation}</p>
                <p style="font-size: 16px; font-weight: 600; color: var(--text-main); font-family: monospace; letter-spacing: 1px;">+91 ${mobile}</p>
            </div>
            <div style="display: flex; justify-content: space-around; background: var(--bg-color); padding: 20px 15px; border-radius: 16px; margin-top: 10px; border: 1px solid #cbd5e1;">
                <div style="text-align: center;">
                    <span style="font-size: 28px; font-family: 'Poppins', sans-serif; font-weight: 700; color: var(--primary);">${total}</span><br>
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Bookings</span>
                </div>
                <div style="width: 2px; background: #cbd5e1; border-radius: 2px;"></div>
                <div style="text-align: center;">
                    <span style="font-size: 28px; font-family: 'Poppins', sans-serif; font-weight: 700; color: var(--primary);">Active</span><br>
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Status</span>
                </div>
            </div>
        `;
    } catch(e) {
        profileDiv.innerHTML = `<p style="text-align: center; color: red;">Error loading account details</p>`;
    }
}
