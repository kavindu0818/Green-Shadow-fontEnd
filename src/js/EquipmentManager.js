
document.getElementById('equ_addBtn').addEventListener('click',function (){
    document.getElementById('equForm').style.display='block';
    document.getElementById('equ_viewDetails').style.display='none';
    document.getElementById('addIcon').style.display='block';
    document.getElementById('equTop').style.display='block';

});

function openModal() {
    document.getElementById("viewModal").style.display = "block";
}

function openUpdateModal() {
    document.getElementById("updateModal").style.display = "block";
}
function closeModal() {
    document.getElementById("viewModal").style.display = "none";
}

function upcloseModal() {
    document.getElementById("updateModal").style.display = "none";
}


// Close modal if user clicks outside of it
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

function triggerFileInput() {
    document.getElementById('fileInput').click();
}

function displaySelectedImage(event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Create an image element and set its src to the selected file's data
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = "100%"; // Adjust size as needed
            img.style.height = "auto"; // Maintain aspect ratio
            img.style.borderRadius = "8px"; // Optional: Style the image

            // Clear previous content in the div and append the new image
            const imageUpdateView = document.getElementById('imageUpdateView');
            imageUpdateView.innerHTML = '';
            imageUpdateView.appendChild(img);
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
}

loadTable();
function loadTable() {
    // $('#fieldTable tbody').empty(); // Clear the table body before appending new rows

    $.ajax({
        url: "http://localhost:5050/green/api/v1/equ",
        type: "GET",
        contentType: "application/json",
        success: (response) => {
            console.log(response)
            let fieldsArray;
            try {
                populateEqaTable(response)
            } catch (error) {
                console.error("Invalid JSON response:", response);
                return;
            }

        }
    });
}
function populateEqaTable(equ) {

    console.log(equ)
    try {
        const tableBody = $("#equTable tbody");
        tableBody.empty(); // Clear existing rows

        equ.forEach((equ) => {
            const row = `
                <tr>
                    <td>${equ.equipmentId}</td>
                    <td>${equ.name}</td>
                    <td>${equ.equipmentType}</td>
                    <td class="action-icons">
                        <i class="fas fa-edit" title="Update" onclick="openUpdateEqeModal('${equ.equipmentId}')"></i>
                        <i class="fas fa-eye" title="View" onclick="viewEquDetails('${equ.equipmentId}')"></i>
                        <i class="fas fa-trash-alt" title="Delete" onclick="deleteField('${equ.equipmentId}')"></i>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    } catch (e) {
        console.error("Error populating table:", e);
    }
}

$("#equ_subBtn").on('click', function () {
    // Get values from input fields
    var equId = $("#equ_inpF1").val();
    var equName = $("#equ_inpF2").val();
    var equType = $("#equ_inpF3").val();
    var equStatus = $("#equ_inpF5").val();
    var equStaff = $("#equ_inpF6").val();
    var equField = $("#equ_inpF7").val();


    // Validate inputs
    if (!equId || !equName || !equType || !equStatus || !equStaff || !equField) {
        alert("All fields are required.");
        return;
    }

    // Create FormData
    var formData = new FormData();
    formData.append("EquipmentId", equId);
    formData.append("name", equName);
    formData.append("equipmentType", equType);
    formData.append("status", equStatus);
    formData.append("staffId", equStaff);
    formData.append("fieldId", equField);

    // AJAX POST request
    $.ajax({
        url: "http://localhost:5050/green/api/v1/equ", // Backend endpoint
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: (response) => {
            console.log("Equipment added successfully:", response);
            alert("Equipment added successfully!");
            clearFields(); // Clear input fields
            fieldIdGenerate(); // Refresh field IDs
        },
        error: (error) => {
            console.error("Error adding equipment:", error);
            alert("Failed to add equipment. Please try again.");
        }
    });
});


setfieldId();
function setfieldId() {
    $.ajax({
        url: "http://localhost:5050/green/api/v1/field", // API endpoint to fetch fields
        type: "GET",
        success: function (response) {
            if (Array.isArray(response)) {
                // Clear existing options
                $("#equ_inpF7").empty();

                // Populate the dropdown with fieldCodes
                response.forEach(function (field) {
                    if (field.fieldCode) { // Ensure fieldCode exists
                        $("#equ_inpF7").append(
                            `<option value="${field.fieldCode}">${field.fieldCode}</option>`
                        );
                    }
                });

                // If no valid fieldCode found, set default option
                if ($("#equ_inpF7").children().length === 0) {
                    $("#equ_inpF7").append(
                        `<option value="FIELD-0001">FIELD-0001</option>`
                    );
                }
            } else {
                console.warn("Invalid response format. Setting default field ID.");
                $("#equ_inpF7").html(
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

setStaffId();
function setStaffId() {
    $.ajax({
        url: "http://localhost:5050/green/api/v1/staff", // API endpoint to fetch fields
        type: "GET",
        success: function (response) {
            if (Array.isArray(response)) {
                // Clear existing options
                $("#equ_inpF6").empty();

                // Populate the dropdown with fieldCodes
                response.forEach(function (staff) {
                    if (staff.id) { // Ensure fieldCode exists
                        $("#equ_inpF6").append(
                            `<option value="${staff.id}">${staff.id}</option>`
                        );
                    }
                });

                // If no valid fieldCode found, set default option
                if ($("#equ_inpF6").children().length === 0) {
                    $("#equ_inpF7").append(
                        `<option value="FIELD-0001">FIELD-0001</option>`
                    );
                }
            } else {
                console.warn("Invalid response format. Setting default field ID.");
                $("#equ_inpF6").html(
                    `<option value="FIELD-0001">FIELD-0001</option>`
                );
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching fields:", error);
            alert("Unable to fetch fields. Using default field ID.");
            $("#staff_inpF6").html(
                `<option value="FIELD-0001">FIELD-0001</option>`
            );
        }
    });
}
function viewEquDetails(equCode) {

    document.getElementById("viewModal").style.display = "block";

    $.ajax({
        url: `http://localhost:5050/green/api/v1/equ/${equCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        success: (equ) => {
            if (!equ) {
                alert("No data found for the selected field.");
                return;
            }
            $("#equ_id").text(equ.equipmentId);
            $("#equ_name").text(equ.name);
            $("#equ_type").text(equ.equipmentType || "N/A");
            $("#equ_status").text(equ.status || "N/A");
            $("#equ_staff").text(equ.staffId || "N/A");
            $("#equ_field").text(equ.fieldId || "N/A");

            // Display the image (in a separate div or img tag)
            $("#field_imageView").html(
                `<img src="data:image/png;base64,${field.fieldImage}" alt="Crop Image" style="width: 130px; height: 80px;">`
            );
        },
        error: (xhr, status, error) => {
            console.error("Error fetching crop details:", error);
            alert("Failed to fetch crop details. Please try again.");
        }
    });
}

function openUpdateEqeModal(equCode) {
    document.getElementById("updateModal").style.display = "block";

    $.ajax({
        url: `http://localhost:5050/green/api/v1/equ/${equCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        success: (equ) => {
            if (!equ) {
                alert("No data found for the selected field.");
                return;
            }
            // Populate the details section with the fetched crop data
            $("#equ_upid").val(equ.equipmentId);
            $("#equ_upName").val(equ.name);
            $("#equ_upType").val(equ.equipmentType || "N/A");
            $("#equ_upCat").val(equ.status || "N/A");
            $("#equ_upSea").val(equ.staffId || "N/A");
            $("#equ_upField").val(equ.fieldId || "N/A");

            // Display the image (in a separate div or img tag)

            // Clear any previously selected file from the file input

        },
        error: (xhr, status, error) => {
            console.error("Error fetching field deails:", error);
            alert("Failed to fetch field details. Please try again.");
        }
    });
}

$(document).ready(function () {
    // Attach a keyup event listener to the search bar
    $("#equ_sbar").on("keyup", function () {
        const searchValue = $(this).val().toLowerCase(); // Get the search value and convert to lowercase

        // Loop through the table rows
        $("#equTable tbody tr").filter(function () {
            // Show or hide rows based on the search value
            $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1);
        });
    });
});

document.getElementById("equUpdateBtn").addEventListener("click", function () {
    const equId = $("#equ_upid").val();
    const equName =$("#equ_upName").val();
    const equType =$("#equ_upType").val();
    const equStatus = $("#equ_upCat").val();
    const equStaff =$("#equ_upSea").val();
    const equField =$("#equ_upField").val();

    if (!equId || !equName || !equType || !equStatus || !equStaff || !equField) {
        alert("All Equipment are required!");
        return;
    }

    const formData = {
        equipmentId: equId,
        name: equName,
        equipmentType: equType,
        status: equStatus,
        staffId: equStaff,
        fieldId: equField,
    };

    console.log("Form data:", formData);

    $.ajax({
        url: `http://localhost:5050/green/api/v1/equ/${formData.equipmentId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function () {
            alert("Equipment details updated successfully!");
            document.getElementById("updateModal").style.display = "none";
        },
        error: function (xhr) {
            console.error("Error:", xhr.responseText || xhr.statusText);
            alert(`Failed to update vehicle details. Error: ${xhr.responseText || xhr.statusText}`);
        },
    });
});

function deleteField(equCode) {
    if (confirm("Are you sure you want to delete this Equipment ?")) {
        $.ajax({
            url: `http://localhost:5050/green/api/v1/equ/${equCode}`, // API endpoint to delete crop
            type: "DELETE",
            success: function (response) {
                alert("Equipment deleted successfully.");
                // Remove the specific row using a unique identifier
                $(`#equTable tbody tr`).filter(function () {
                    return $(this).find("td").eq(0).text().trim() === equCode; // Match the first <td> (Crop ID)
                }).remove();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting equipment:", error);
                alert("Failed to delete the equipment . Please try again.");
            }
        });
    }
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