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

    if (!username || !password) return;

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
    let existingCalendar = document.getElementById("calendar-container");

    if (!existingCalendar) {
        let calendarContainer = document.createElement("div");
        calendarContainer.id = "calendar-container";
        calendarContainer.style.display = "block";
        calendarContainer.style.backgroundColor = "#2a2a2a";
        calendarContainer.style.color = "white";
        calendarContainer.style.padding = "20px";
        calendarContainer.style.marginTop = "20px";
        calendarContainer.style.border = "1px solid white";
        calendarContainer.style.textAlign = "center";
        calendarContainer.style.width = "60%";
        calendarContainer.style.marginLeft = "auto";
        calendarContainer.style.marginRight = "auto";
        calendarContainer.style.borderRadius = "8px";
        calendarContainer.style.boxShadow = "0px 0px 10px rgba(255, 255, 255, 0.2)";

        let title = document.createElement("h2");
        title.innerText = "Calendar";
        title.style.marginBottom = "10px";

        let calendar = document.createElement("div");
        calendar.id = "calendar";
        calendar.style.display = "grid";
        calendar.style.gridTemplateColumns = "repeat(7, 1fr)";
        calendar.style.gap = "5px";
        calendar.style.marginTop = "10px";

        calendarContainer.appendChild(title);
        calendarContainer.appendChild(calendar);
        document.body.appendChild(calendarContainer);
    }

    generateCalendar();
}

function closeCalendar() {
    let calendarContainer = document.getElementById("calendar-container");
    if (calendarContainer) {
        calendarContainer.remove();
    }
}

function generateCalendar() {
    const calendar = document.getElementById("calendar");
    if (!calendar) return;

    calendar.innerHTML = ""; // Clear previous calendar

    let daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    weekdays.forEach(day => {
        let dayLabel = document.createElement("div");
        dayLabel.innerText = day;
        dayLabel.style.fontWeight = "bold";
        dayLabel.style.borderBottom = "1px solid white";
        dayLabel.style.padding = "5px";
        calendar.appendChild(dayLabel);
    });

    let firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();

    for (let i = 0; i < firstDay; i++) {
        let emptySlot = document.createElement("div");
        emptySlot.innerText = "";
        calendar.appendChild(emptySlot);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        let day = document.createElement("div");
        day.innerText = i;
        day.style.border = "1px solid white";
        day.style.padding = "10px";
        day.style.textAlign = "center";
        day.style.cursor = "pointer";

        day.addEventListener("click", () => {
            alert(`You selected ${i}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`);
        });

        calendar.appendChild(day);
    }
}

window.onload = function() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("command-section").style.display = "none";
};
