cropCount();

// Fetch crop data from the API
function cropCount() {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }
    $.ajax({
        url: "http://localhost:8080/api/v1/crop", // API endpoint to fetch crops data
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            var cropCount = response.length; // Adjust this if the response structure is different
            $("#cropCount").text(cropCount); // Use .text() to update the <h2> element
        },
        error: function (xhr, status, error) {
            console.error("Error fetching crop data: ", error);
            $("#cropCount").text("0"); // If error occurs, set crop count to 0
        }
    });
}


fieldCount();
function fieldCount() {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/field", // API endpoint to fetch crops data
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            var fieldCount = response.length; // Adjust this if the response structure is different
             $("#fieldCount").text(fieldCount) // Update the dashboard with the fetched crop count
        },
        error: function (xhr, status, error) {
            console.error("Error fetching crop data: ", error);
            updateDashboard(0); // If error occurs, set crop count to 0
        }
    });
}

staffCount();
function staffCount() {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/staff", // API endpoint to fetch crops data
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            var staffCount = response.length; // Adjust this if the response structure is different
            $("#staffCount").text(staffCount) // Update the dashboard with the fetched crop count
        },
        error: function (xhr, status, error) {
            console.error("Error fetching crop data: ", error);
            updateDashboard(0); // If error occurs, set crop count to 0
        }
    });
}

equCount();
function equCount() {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/equ", // API endpoint to fetch crops data
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            var equCount = response.length; // Adjust this if the response structure is different
            $("#equipmentCount").text(equCount) // Update the dashboard with the fetched crop count
        },
        error: function (xhr, status, error) {
            console.error("Error fetching crop data: ", error);
            updateDashboard(0); // If error occurs, set crop count to 0
        }
    });
}

vehCount();
function vehCount() {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/veh", // API endpoint to fetch crops data
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            var vehCount = response.length; // Adjust this if the response structure is different
            $("#vehicleCount").text(vehCount) // Update the dashboard with the fetched crop count
        },
        error: function (xhr, status, error) {
            console.error("Error fetching crop data: ", error);
            updateDashboard(0); // If error occurs, set crop count to 0
        }
    });
}
// Typewriter animation for "GREEN SHADOW"
const text = "GREEN SHADOW"; // The text to animate
const h1Element = document.getElementById("des_h1");
let index = 0;

function typeWriter() {
    if (index < text.length) {
        h1Element.innerHTML += text[index];
        index++;
        setTimeout(typeWriter, 100); // Adjust the typing speed here
    }
}

typeWriter()


function updateDateTime() {
    const now = new Date();

    // Get day, date, and time
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = daysOfWeek[now.getDay()]; // Get current day of the week
    const date = now.toLocaleDateString("en-US", { day: '2-digit', month: 'long', year: 'numeric' }); // Format date
    const time = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true }); // Format time (AM/PM)

    // Set the dynamic values to HTML
    document.getElementById("viewDay").textContent = day;
    document.getElementById("viewDate").textContent = date;
    document.getElementById("time").textContent = time;
}

// Call the updateDateTime function to set the current time and date
updateDateTime();

// Optionally, update the time every minute
setInterval(updateDateTime, 60000); // Update every 60 seconds


let currentDate = new Date();

// Function to render the calendar
function renderCalendar() {
    const month = currentDate.getMonth(); // Current month (0-11)
    const year = currentDate.getFullYear(); // Current year
    const firstDay = new Date(year, month, 1); // First day of the month
    const lastDay = new Date(year, month + 1, 0); // Last day of the month

    const daysInMonth = lastDay.getDate(); // Total days in the month
    const startDay = firstDay.getDay(); // Day of the week the month starts on

    // Get month and year to display in header
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById("month-year").innerHTML = `${monthNames[month]} ${year}`;

    // Create the table rows and columns for the calendar
    let calendarHTML = "<tr>";
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Add the weekday names as headers
    for (let i = 0; i < weekdays.length; i++) {
        calendarHTML += `<th>${weekdays[i]}</th>`;
    }
    calendarHTML += "</tr><tr>";

    // Add empty cells for the days before the 1st of the month
    for (let i = 0; i < startDay; i++) {
        calendarHTML += "<td></td>";
    }

    // Add the actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarHTML += `<td>${day}</td>`;
        if ((startDay + day) % 7 === 0) {
            calendarHTML += "</tr><tr>"; // Start a new row every week
        }
    }

    // Fill the table with the calendar HTML
    document.getElementById("calendar").innerHTML = calendarHTML;
}

// Function to go to the previous month
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

// Function to go to the next month
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Event listener for the image click
document.getElementById("calenderView").addEventListener("click", function() {
    // Hide the image and show the calendar container
    document.getElementById("calenderView").style.display = "none";
    document.getElementById("calendar-container").style.display = "block";

    // Render the current month's calendar
    renderCalendar();
});



// Start the typewriter animation
