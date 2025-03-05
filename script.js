const USERS = {
    "admin": "password123",
    "user": "1234",
    "lane": "johnson",
    "maysen": "graber"
};

let currentUser = "";

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        return;
    }

    if (USERS[username] && USERS[username] === password) {
        currentUser = username;
        document.getElementById("login-container").style.display = "none";
        document.getElementById("command-section").style.display = "block";
        document.getElementById("command-input").focus();
        document.getElementById("prompt").innerText = `C:\\${currentUser}> `;
    } else {
        document.getElementById("error-message").style.display = "block";
    }
}

function checkCommand(event) {
    if (event.key === "Enter") {
        let commandInput = document.getElementById("command-input");
        let command = commandInput.value.trim().toLowerCase();
        let output = document.getElementById("error-message-command");

        output.innerHTML = ""; // Clear previous errors

        if (command === "show calendar") {
            showCalendar();
        } else if (command === "close calendar") {
            closeCalendar();
        } else {
            output.innerHTML = `ERROR: Command "${command}" not recognized.`;
        }

        commandInput.value = ""; // Clear input field
    }
}

function showCalendar() {
    let calendarSection = document.getElementById("calendar-section");

    if (!calendarSection) {
        calendarSection = document.createElement("div");
        calendarSection.id = "calendar-section";
        calendarSection.style.display = "block";
        calendarSection.style.backgroundColor = "#2a2a2a";
        calendarSection.style.padding = "10px";
        calendarSection.style.marginTop = "10px";
        calendarSection.style.border = "1px solid white";
        calendarSection.style.color = "white";

        let title = document.createElement("h2");
        title.innerText = "Calendar";
        title.style.textAlign = "center";

        let calendar = document.createElement("div");
        calendar.id = "calendar";
        calendar.style.display = "grid";
        calendar.style.gridTemplateColumns = "repeat(7, 1fr)";
        calendar.style.gap = "5px";
        calendar.style.marginTop = "10px";

        calendarSection.appendChild(title);
        calendarSection.appendChild(calendar);
        document.body.appendChild(calendarSection);
    }

    generateCalendar();
}

function closeCalendar() {
    let calendarSection = document.getElementById("calendar-section");
    if (calendarSection) {
        calendarSection.remove();
    }
}

function generateCalendar() {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = ""; // Clear previous calendar

    let daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
        let day = document.createElement("div");
        day.classList.add("calendar-day");
        day.innerText = i;
        day.style.border = "1px solid white";
        day.style.padding = "10px";
        day.style.textAlign = "center";
        calendar.appendChild(day);
    }
}

// Show login form on page load
window.onload = function() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("command-section").style.display = "none";
};
