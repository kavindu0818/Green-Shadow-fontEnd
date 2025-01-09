
document.getElementById('addBtn').addEventListener('click',function (){
    document.getElementById('cropForm').style.display='block';
    document.getElementById('viewDetails').style.display='none';
    document.getElementById('imgPlant').style.display='block';
    document.getElementById('cropTop').style.display='block';

});

const fieldCodeRegEx = /^CROP-[0-9]{4}$/;
const fieldNameRegEx = /^[A-Za-z ]{3,50}$/;
const fieldLocationRegEx = /^[A-Za-z0-9, ]{3,100}$/;
const fieldSizeRegEx = /^[0-9]+(\.[0-9]+)$/;

let fieldValidations = [
    { reg: fieldCodeRegEx, field: $("#inpF1"),  },
    { reg: fieldNameRegEx, field: $("#inpF2"),  },
    { reg: fieldNameRegEx, field: $("#inpF3"),  },
    { reg: fieldLocationRegEx, field: $("#inpF5"), },
    { reg: fieldNameRegEx, field: $("#inpF6"),  },

    // { reg: fieldSizeRegEx, field: $("#inpFe5"), },
];

function checkFieldValidity() {
    let errorCount = 0;
    for (let validation of fieldValidations) {
        if (check(validation.reg, validation.field)) {
            setSuccess(validation.field);
        } else {
            errorCount++;
            setError(validation.field);
        }
    }
    $("#saveField").attr("disabled", errorCount > 0);
}

function check(regex, field) {
    return regex.test(field.val().trim()); // Added `.trim()` to avoid leading/trailing space issues
}

function setSuccess(field) {
    field.css("border", "2px solid green").next();
}

function setError(field) {
    field.css("border", "2px solid red").next();
}

$(document).ready(() => {
    // Corrected event listener for keyup and blur events
    $("#inpF1, #inpF2, #inpF3, #inpF5, #inpF6").on("keyup blur", checkFieldValidity);
});

function viewCropDetails(cropCode) {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    document.getElementById("viewModal").style.display = "block";

    $.ajax({
        url: `http://localhost:8080/api/v1/crop/${cropCode}`,
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (crop) => {
            if (!crop) {
                alert("No data found for the selected crop.");
                return;
            }

            console.log(crop)

            $("#cropCode").text(crop.cropCode);
            $("#comName").text(crop.commonName);
            $("#csiName").text(crop.scientificName || "N/A");
            $("#cropCat").text(crop.category || "N/A");
            $("#cropSeason").text(crop.season || "N/A");
            $("#cropField").text(crop.field_code?.fieldCode || "N/A");
            $("#imageView").html(`<img src="data:image/png;base64,${crop.image}" alt="Crop Image" style="width: 150px; height: 100px;">`);
        },
        error: (xhr, status, error) => {
            console.error("Error fetching crop details:", error);
            alert("Failed to fetch crop details. Please try again.");
        }
    });
}

function openUpdateModal(cropCode) {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }
    document.getElementById("updateModal").style.display = "block";

    $.ajax({
        url: `http://localhost:8080/api/v1/crop/${cropCode}`,
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (crop) => {
            if (!crop) {
                alert("No data found for the selected crop.");
                return;
            }
            $("#upCode").val(crop.cropCode);
            $("#upName").val(crop.commonName);
            $("#upsName").val(crop.scientificName || "N/A");
            $("#upCat").val(crop.category || "N/A");
            $("#upSea").val(crop.season || "N/A");
            $("#upField").val(crop.field_code?.fieldCode || "N/A");

            console.log(crop)

            // Display the image (in a separate div or img tag)
            $("#imageUpdateView").html(
                `<img src="data:image/png;base64,${crop.image}" alt="Crop Image" style="width: 130px; height: 80px;">`
            );

            // Clear any previously selected file from the file input
            $("#fileInput").val("");
        },
        error: (xhr, status, error) => {
            console.error("Error fetching crop details:", error);
            alert("Failed to fetch crop details. Please try again.");
        }
    });
}


document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {

            const imageData = e.target.result;
            $("#imageUpdateView").html(
                `<img src="${imageData}" alt="Updated Crop Image" style="width: 150px; height: 80px;">`
            );
        };
        reader.readAsDataURL(file);
    }
});

function closeModal() {
    document.getElementById("viewModal").style.display = "none";
}

function upcloseModal() {
    document.getElementById("updateModal").style.display = "none";
}


window.onclick = function(event) {
    const modal = document.getElementById("viewModal");
    if (event.target == modal) {
        closeModal();
    }
}

window.onclick = function(event) {
    const modal = document.getElementById("updateModal");
    if (event.target == modal) {
        upcloseModal();
    }
}

document.getElementById("changeImage").addEventListener("click", function () {
    // Trigger the hidden file input
    document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
        const reader = new FileReader();


        reader.onload = function (e) {
            const imageUpdateView = document.getElementById("imageUpdateView");
            imageUpdateView.innerHTML = ''; // Clear any existing content
            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";
            imageUpdateView.appendChild(img);
        };

        reader.readAsDataURL(file);
    }
});


function triggerFileInput() {
    document.getElementById('fileInput').click();
}

function displaySelectedImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {

            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = "100%";
            img.style.height = "auto";
            img.style.borderRadius = "8px";


            const imageUpdateView = document.getElementById('imageUpdateView');
            imageUpdateView.innerHTML = '';
            imageUpdateView.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}
$("#subBtn").on('click', function() {
    const token=localStorage.getItem("token");
    if (!token){
        alert("No token found");
        return
    }

    // Get values from input fields
    var cropCode = $("#inpF1").val();
    var cropName = $("#inpF2").val();
    var cropScientificName = $("#inpF3").val();
    var cropCategory = $("#inpF5").val();
    var cropSeason = $("#inpF6").val();
    var cropField = $("#inpF7").val();

    // Collect file input
    var cropImage = $("#inpF4")[0].files[0];

    // Create a FormData object for file upload
    var formData = new FormData();
    formData.append("cropCode", cropCode);
    formData.append("commonName", cropName);
    formData.append("scientificName", cropScientificName);
    formData.append("image", cropImage);
    formData.append("category", cropCategory);
    formData.append("season", cropSeason);
    formData.append("field_code", cropField);

    // Send AJAX POST request to the backend
    $.ajax({
        url: "http://localhost:8080/api/v1/crop",
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (response) => {
            console.log("Crop added successfully:", response);
            alert("Crop added successfully!");
            clearFields();
            cropIdGenerate();
        },
        error: (error) => {
            console.error("Error adding crop:", error);
            alert("Failed to add crop. Please try again.");
        }
    });
});



// Function to clear input fields
function clearFields() {
    $("#inpF1").val('');
    $("#inpF2").val('');
    $("#inpF3").val('');
    $("#inpF5").val('');
    $("#inpF6").val('');
    $("#inpF7").val('');
    $("#inpF4").val('');
}


// =====================================Loard value in table===========
loadCropTable();
function loadCropTable() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("No token found. Please log in again.");
        console.error("Token is missing from localStorage.");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/crop",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (response) => {
            console.log("Crops fetched successfully:", response);
            populateCropTable(response);
        },
        error: (xhr, status, error) => {
            if (xhr.status === 401) {
                alert("Unauthorized: Invalid or expired token. Please log in again.");
                console.error("Unauthorized access:", xhr.responseText || error);
                // Optionally redirect to login page
                window.location.href = "/login";
            } else if (xhr.status === 500) {
                alert("Server error. Please try again later.");
                console.error("Server error:", xhr.responseText || error);
            } else {
                alert("Failed to load crops. Please check your network or contact support.");
                console.error("Error fetching crops:", xhr.responseText || error);
            }
        }
    });
}


function populateCropTable(crops) {

    console.log(crops)
    try {
        const tableBody = $("#cropTable tbody");
        tableBody.empty(); // Clear existing rows

        crops.forEach((crop) => {
            const row = `
                <tr>
                    <td>${crop.cropCode}</td>
                    <td>${crop.commonName}</td>
                    <td><img src="data:image/png;base64,${crop.image}" alt="Crop Image" style="width: 50px; height: 50px;"></td>
                    <td>${crop.category}</td>
                    <td class="action-icons">
                        <i class="fas fa-edit" title="Update" onclick="openUpdateModal('${crop.cropCode}')"></i>
                        <i class="fas fa-eye" title="View"  onclick="viewCropDetails('${crop.cropCode}')"></i>
                        <i class="fas fa-trash-alt" title="Delete" onclick="deleteCrop('${crop.cropCode}')"></i>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    } catch (e) {
        console.error("Error populating table:", e);
    }
}

// =================================Search in Table========================================================
$(document).ready(function () {
    // Attach a keyup event listener to the search bar
    $("#sbar").on("keyup", function () {
        const searchValue = $(this).val().toLowerCase(); // Get the search value and convert to lowercase

        // Loop through the table rows
        $("#cropTable tbody tr").filter(function () {
            // Show or hide rows based on the search value
            $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1);
        });
    });
});


// ==========================Genrate crop Id=========================================

function cropIdGenerate() {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/crop", // API endpoint to fetch crops
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },

        success: function (response) {
            // Assuming the response is an array of crop objects
            if (Array.isArray(response) && response.length > 0) {
                // Get the last crop in the array
                const lastCrop = response[response.length - 1];
                const lastCropCode = lastCrop.cropCode;

                // Split the last crop code and generate the next ID
                const lastIdParts = lastCropCode.split('-');
                const lastNumber = parseInt(lastIdParts[1]);
                const nextId = `CROP-${String(lastNumber + 1).padStart(4, '0')}`;

                // Set the next crop ID in the input field
                $("#inpF1").val(nextId);
            } else {
                // If no crops found, set to default value
                $("#inpF1").val("CROP-0001");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching last Crop ID:", error);
            alert("Unable to fetch the last Crop ID. Using default ID.");
            $("#inpF1").val('CROP-0001'); // Set default ID in case of error
        }
    });
}

function deleteCrop(cropCode) {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }
    if (confirm("Are you sure you want to delete this crop?")) {
        $.ajax({
            url: `http://localhost:8080/api/v1/crop/${cropCode}`, // API endpoint to delete crop
            type: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (response) {
                alert("Crop deleted successfully.");
                // Remove the specific row using a unique identifier
                $(`#cropTable tbody tr`).filter(function () {
                    return $(this).find("td").eq(0).text().trim() === cropCode; // Match the first <td> (Crop ID)
                }).remove();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting crop:", error);
                alert("Failed to delete the crop. Please try again.");
            }
        });
    }
}



// Example usage: Generate and set the next crop ID in an input field
$(document).ready(function () {
    cropIdGenerate(); // Automatically fetch and set the next Crop ID on page load
});

document.getElementById("changeImage").addEventListener("click", function () {
    document.getElementById("fileInput").click();
});

document.getElementById("cropUpdateBtn").addEventListener("click", function () {
    var cropCode = $("#upCode").val();
    var cropName = $("#upName").val();
    var scientificName = $("#upsName").val();
    var category = $("#upCat").val();
    var season = $("#upSea").val();
    var field = $("#upField").val();

    // Check if a new image is selected
    var cropImage = $("#fileInput")[0].files[0];

    // If no new image is selected, use the currently displayed image
    var imageBase64 = $("#imageUpdateView img").attr("src");

    if (!cropCode || !cropName || !scientificName || !category || !season || !field) {
        alert("All fields except the image are required!");
        return;
    }

    const formData = new FormData();
    formData.append("cropCode", cropCode);
    formData.append("commonName", cropName);
    formData.append("scientificName", scientificName);
    formData.append("category", category);
    formData.append("season", season);
    formData.append("fieldCode", field);

    // Attach the image data
    if (cropImage) {
        formData.append("image", cropImage); // New image file
    } else if (imageBase64) {
        // Convert base64 string to Blob and attach it
        const blob = base64ToBlob(imageBase64);
        formData.append("image", blob, "existing-image.png");
    } else {
        alert("No image provided!");
        return;
    }

    updateCropDetails(cropCode, formData);
});

// Helper function to convert base64 to Blob
function base64ToBlob(base64Data) {
    const byteString = atob(base64Data.split(",")[1]); // Decode base64
    const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0]; // Extract MIME type

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}


// Trigger the file input when the "Change Image" button is clicked
document.getElementById("changeImage").addEventListener("click", function () {
    document.getElementById("fileInput").click();
});

document.getElementById("cleBtn").addEventListener("click", function () {
    clearFields();
});

// Listen for file input change and update the preview
document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Display the new image in the update modal
            const imageData = e.target.result;
            $("#imageUpdateView").html(
                `<img src="${imageData}" alt="Updated Crop Image" style="width: 100px; height: 80px;">`
            );
        };
        reader.readAsDataURL(file); // Convert file to base64 string
    }
});

function updateCropDetails(cropCode, formData) {
    console.log("hiiiiiiiii" + cropCode)

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/api/v1/crop/${cropCode}`, // API endpoint for updating crop
        type: "PUT",
        processData: false,
        contentType: false,
        data: formData,
        headers: {
            "Authorization": "Bearer " + token
        },

        success: function (data) {
            console.log("Success:", data);
            alert("Crop updated successfully!");
        },
        error: function (xhr, status, error) {
            console.error("Error response:", xhr.responseText || error);
            alert(`Failed to update crop details. Error: ${xhr.responseText || error}`);
        },
    });
}

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

setfieldId();
function setfieldId() {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }


    $.ajax({
        url: "http://localhost:8080/api/v1/field", // API endpoint to fetch fields
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            if (Array.isArray(response)) {
                // Clear existing options
                $("#inpF7").empty();

                // Populate the dropdown with fieldCodes
                response.forEach(function (field) {
                    if (field.fieldCode) { // Ensure fieldCode exists
                        $("#inpF7").append(
                            `<option value="${field.fieldCode}">${field.fieldCode}</option>`
                        );
                    }
                });

                // If no valid fieldCode found, set default option
                if ($("#inpF7").children().length === 0) {
                    $("#inpF7").append(
                        `<option value="FIELD-0001">FIELD-0001</option>`
                    );
                }
            } else {
                console.warn("Invalid response format. Setting default field ID.");
                $("#inpF7").html(
                    `<option value="FIELD-0001">FIELD-0001</option>`
                );
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching fields:", error);
            alert("Unable to fetch fields. Using default field ID.");
            $("#staff_inpF13").html(
                `<option value="FIELD-0001">FIELD-0001</option>`
            );
        }
    });
}

