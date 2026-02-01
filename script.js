const API_URL = "http://localhost:5000/api";

// role toggle code stays same
const studentBtn = document.getElementById("studentBtn");
const wardenBtn = document.getElementById("wardenBtn");
const roleInput = document.getElementById("role");

studentBtn.addEventListener("click", () => {
    studentBtn.classList.add("active");
    wardenBtn.classList.remove("active");
    roleInput.value = "student";
});

wardenBtn.addEventListener("click", () => {
    wardenBtn.classList.add("active");
    studentBtn.classList.remove("active");
    if (maintenanceBtn) maintenanceBtn.classList.remove("active");
    roleInput.value = "warden";
});

const maintenanceBtn = document.getElementById("maintenanceBtn");
if (maintenanceBtn) {
    maintenanceBtn.addEventListener("click", () => {
        maintenanceBtn.classList.add("active");
        studentBtn.classList.remove("active");
        wardenBtn.classList.remove("active");
        roleInput.value = "maintenance";
    });
}

// 🔥 REAL LOGIN (FRONTEND → BACKEND)
function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.token) {
            alert("Invalid login");
            return;
        }

        // save login session
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id);

        // role-based redirect
        if (data.role === "student") {
            window.location.href = "student.html";
        } else if (data.role === "warden") {
            window.location.href = "warden.html";
        } else if (data.role === "maintenance") {
            window.location.href = "maintenance.html";
        }
    })
    .catch(err => {
        console.error(err);
        alert("Server error");
    });
}

// common functions
function showSection(sectionId) {
    document.querySelectorAll(".section")
        .forEach(sec => sec.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
}

function logout() {
    localStorage.clear();
    window.location.href = "frontend1.html";
}
function selectRole(role) {
    document.getElementById("role").value = role;

    document.getElementById("studentBtn").classList.remove("active");
    document.getElementById("wardenBtn").classList.remove("active");

    if (role === "student") {
        document.getElementById("studentBtn").classList.add("active");
    } else {
        document.getElementById("wardenBtn").classList.add("active");
    }
}

function login(event) {
    event.preventDefault();

    const role = document.getElementById("role").value;

    // After successful login
    if (role === "student") {
        window.location.href = "student.html";
    } else {
        window.location.href = "warden.html";
    }
}
const complaintForm = document.getElementById("complaintForm");

if (complaintForm) {
    complaintForm.addEventListener("submit", submitComplaint);
}

function submitComplaint(e) {
    e.preventDefault();

    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;
    const image = document.getElementById("image").files[0];

    if (!category || !description) {
        alert("Please fill all required fields");
        return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("description", description);
    formData.append("priority", priority);
    if (image) formData.append("image", image);

    fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            alert(data.message || "Complaint failed");
            return;
        }

        alert("✅ Complaint submitted successfully");
        complaintForm.reset();
    })
    .catch(err => {
        console.error(err);
        alert("Server error while submitting complaint");
    });
}
