
document.getElementById('staff_addBtn').addEventListener('click',function (){
    document.getElementById('staffForm').style.display='block';
    document.getElementById('staff_viewDetails').style.display='none';
    document.getElementById('addIcon').style.display='block';
    document.getElementById('staffTop').style.display='block';

});

const fieldCodeRegEx = /^STAFF-[0-9]{4}$/;
const fieldNameRegEx = /^[A-Za-z ]{3,50}$/;
const fieldLocationRegEx = /^[A-Za-z0-9, ]{3,100}$/;
const fieldSizeRegEx = /^[0-9]+(\.[0-9]+)$/;
const fieldNumberRegEx = /^[0-9]{3,11}$/;

let fieldValidations = [
    { reg: fieldCodeRegEx, field: $("#staff_inpF1"),  },
    { reg: fieldNameRegEx, field: $("#staff_inpF2"),  },
    { reg: fieldNameRegEx, field: $("#staff_inpF3"),  },
    { reg: fieldLocationRegEx, field: $("#staff_inpF4"), },
    { reg: fieldLocationRegEx, field: $("#staff_inpF7"), },
    { reg: fieldLocationRegEx, field: $("#staff_inpF8"), },
    { reg: fieldLocationRegEx, field: $("#staff_inpF9"), },
    { reg: fieldNumberRegEx, field: $("#staff_inpF10"), },
    { reg: fieldLocationRegEx, field: $("#staff_inpF11"), },

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
    $("#staff_inpF1, #staff_inpF2, #staff_inpF3, #staff_inpF4, #staff_inpF7, #staff_inpF8, #staff_inpF9, #staff_inpF10, #staff_inpF11").on("keyup blur", checkFieldValidity);
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

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/staff",
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (response) => {
            console.log(response);
            try {
                populateStaffTable(response);  // Corrected function name
            } catch (error) {
                console.error("Invalid JSON response:", response);
                return;
            }
        }
    });
}

function populateStaffTable(staff) {
    console.log(staff);
    try {
        const tableBody = $("#staffTable tbody");
        tableBody.empty(); // Clear existing rows

        staff.forEach((staffMember) => {  // Changed variable name to staffMember
            const row = `
                <tr>
                    <td>${staffMember.id}</td>
                    <td>${staffMember.firstName}</td>
                    <td>${staffMember.contact}</td>
                    <td>${staffMember.designation}</td>
                    <td class="action-icons">
                        <i class="fas fa-edit" title="Update" onclick="openUpdateStaffModal('${staffMember.id}')"></i>
                        <i class="fas fa-eye" title="View" onclick="viewCropDetails('${staffMember.id}')"></i>
                        <i class="fas fa-trash-alt" title="Delete" onclick="deleteStaff('${staffMember.id}')"></i>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    } catch (e) {
        console.error("Error populating table:", e);
    }
}

$(document).ready(function () {
    // Attach a keyup event listener to the search bar
    $("#staff_sbar").on("keyup", function () {
        const searchValue = $(this).val().toLowerCase(); // Get the search value and convert to lowercase

        // Loop through the table rows
        $("#staffTable tbody tr").filter(function () {
            // Show or hide rows based on the search value
            $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1);
        });
    });
});

function deleteStaff(staffCode) {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    if (confirm("Are you sure you want to delete this Staff?")) {
        $.ajax({
            url: `http://localhost:8080/api/v1/field/${staffCode}`, // API endpoint to delete crop
            type: "DELETE",
            headers: {
            "Authorization": "Bearer " + token
        },
            success: function (response) {
                alert("Staff deleted successfully.");

                $(`#staffTable tbody tr`).filter(function () {
                    return $(this).find("td").eq(0).text().trim() === staffCode; // Match the first <td> (Crop ID)
                }).remove();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting staff:", error);
                alert("Failed to delete the staff. Please try again.");
            }
        });
    }
}

$("#staff_subBtn").on("click",function(){
    saveStaffData();
});


async function saveStaffData() {

    const fieldCode = $("#staff_inpF13").val();
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    let fields = [];
    try {
        const fieldResponse = await $.ajax({
            url: `http://localhost:8080/api/v1/field/${fieldCode}`,
            method: "GET",
            timeout: 0,
            headers: {
            "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token,
            }
        });
        console.log("Field data fetched:", fieldResponse);

        fields.push({
            fieldCode: fieldResponse.fieldCode,
            fieldName: fieldResponse.fieldName,
            fieldLocation: fieldResponse.fieldLocation,
            fieldSize: fieldResponse.fieldSize,
            fieldImage: fieldResponse.fieldImage,
        });
    } catch (error) {
        console.error("Failed to load field data:", error);
        alert("Failed to load field data. Please try again.");
        return; // Stop execution if field data cannot be loaded
    }

    // Collect staff data
    const id = $("#staff_inpF1").val();
    const firstName = $("#staff_inpF2").val();
    const lastName = $("#staff_inpF3").val();
    const designation = $("#staff_inpF4").val();
    const gender = $("#staff_inpF5").val();
    const joinedDate = $("#staff_inpF14").val();
    const dob = $("#staff_inpF6").val();

    const address1 = $("#staff_inpF7").val();
   const address2 = $("#staff_inpF8").val();
   const address3 = $("#staff_inpF9").val();
    const address = address1 + " " + address2 + " " + address3;
    const contact = $("#staff_inpF10").val();
    const email = $("#staff_inpF11").val();
    const role = $("#staff_inpF12").val();

    if (!id || !firstName || !lastName || !designation || !gender || !dob || !address || !contact || !email || !role) {
        alert("All fields are required!");
        return;
    }

    const staffData = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        designation: designation,
        gender: gender,
        joinedDate: joinedDate,
        dob: dob,
        address: address,
        contact: contact,
        email: email,
        role: role,
        fields
    };

    console.log("Prepared staff data:", staffData);

    // Save staff data
    try {
        const response = await $.ajax({
            url: "http://localhost:8080/api/v1/staff",
            type: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            data: JSON.stringify(staffData),
        });
        console.log("Staff added successfully:", response);
        alert("Staff added successfully!");
        clearFields();
        staffIdGenerate();
        loadStaffTable();
    } catch (xhr) {
        console.error("Error adding staff:", xhr.responseText || xhr.statusText);
        alert("Failed to add staff: " + (xhr.responseText || xhr.statusText));
    }
}

$("#staff_subBtn").on('click', function() {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }
    // Get values from input fields
    var code = $("#staff_inpF1").val();
    var firstName = $("#staff_inpF2").val();
    var lastName = $("#staff_inpF3").val();
    var designation = $("#staff_inpF4").val();
    var gender = $("#staff_inpF5").val();
    let dob = $("#staff_inpF6").val(); // Expecting `yyyy-MM-dd` input format
    var address1 = $("#staff_inpF7").val();
    var address2 = $("#staff_inpF8").val();
    var address3 = $("#staff_inpF9").val();
    var contact = $("#staff_inpF10").val();
    var email = $("#staff_inpF11").val();
    var role = $("#staff_inpF12").val();
    var field = $("#staff_inpF13").val();
    let joindate = $("#staff_inpF14").val(); // Expecting `yyyy-MM-dd` input format

    var address = address1 + " " + address2 + " " + address3;

    console.log(role + "11")

    // Create a FormData object for file upload
    var formData = new FormData();
    formData.append("id", code);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("designation", designation);
    formData.append("gender", gender);
    formData.append("joinedDate", joindate); // Correct format
    formData.append("dob", dob); // Correct format
    formData.append("address", address);
    formData.append("contact", contact);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("fieldCodes", field);

    // Send AJAX POST request to the backend
    $.ajax({
        url: "http://localhost:8080/api/v1/staff", // Backend endpoint
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        headers: {
            "Authorization": "Bearer " + token
        },// Form data with fields and file
        success: (response) => {
            console.log("Staff added successfully:", response);
            alert("Staff added successfully!");
            clearFields();
            fieldIdGenerate(); // Clear input fields after success
        },
        error: (error) => {
            console.error("Error adding staff:", error);
            alert("Failed to add staff. Please try again.");
        }
    });
});

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
                $("#staff_inpF13").empty();

                // Populate the dropdown with fieldCodes
                response.forEach(function (field) {
                    if (field.fieldCode) { // Ensure fieldCode exists
                        $("#staff_inpF13").append(
                            `<option value="${field.fieldCode}">${field.fieldCode}</option>`
                        );
                    }
                });

                // If no valid fieldCode found, set default option
                if ($("#staff_inpF13").children().length === 0) {
                    $("#staff_inpF13").append(
                        `<option value="FIELD-0001">FIELD-0001</option>`
                    );
                }
            } else {
                console.warn("Invalid response format. Setting default field ID.");
                $("#staff_inpF13").html(
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

// Call the function to populate the dropdown
setfieldId();
function clearFields() {
    $("#staff_inpFe2").val('');
    $("#staff_inpFe3").val('');
    $("#staff_inpFe4").val('');
    $("#inpFe").val('');
    $("#staff_inpFe7").val('');
    $("#staff_inpFe8").val('');
    $("#staff_inpFe9").val('');
    $("#staff_inpFe10").val('');
    $("#staff_inpFe11").val('');
}

function openUpdateStaffModal(staffCode) {
    document.getElementById("updateModal").style.display = "block";

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/api/v1/staff/${staffCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (staff) => {
            if (!staff) {
                alert("No data found for the selected field.");
                return;
            }

            console.log(staff);
            // Populate the details section with the fetched crop data
            $("#staff_upid").val(staff.id);
            $("#staff_upfirstName").val(staff.firstName);
            $("#staff_uplastName").val(staff.lastName || "N/A");
            $("#staff_upDesignation").val(staff.designation || "N/A");
            $("#staff_upGender").val(staff.gender || "N/A");
            $("#staff_upJoinDate").val(staff.joinedDate || "N/A");
            $("#staff_upDob").val(staff.dob || "N/A");
            $("#staff_upContactNo").val(staff.contact || "N/A");
            $("#staff_upAddress").val(staff.address || "N/A");
            $("#staff_upEmail").val(staff.email || "N/A");
            $("#staff_upRole").val(staff.role);
            $("#staff_upField").val(staff.fields?.[0]?.fieldCode || "");

            // Display the image (in a separate div or img tag)

            // Clear any previously selected file from the file input
        },
        error: (xhr, status, error) => {
            console.error("Error fetching field deails:", error);
            alert("Failed to fetch field details. Please try again.");
        }
    });
}

function viewCropDetails(staffCode) {

    document.getElementById("viewModal").style.display = "block";

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/api/v1/staff/${staffCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (field) => {
            if (!field) {
                alert("No data found for the selected field.");
                return;
            }

            var name = field.firstName + " " + field.lastName
            $("#staff-id").text(field.id);
            $("#staff-name").text(name);
            $("#staff-designation").text(field.designation || "N/A");
            $("#staff-gender").text(field.gender || "N/A");
            $("#staff-joinDate").text(field.joinedDate || "N/A");
            $("#staff-dob").text(field.dob || "N/A");
            $("#staff-address").text(field.address || "N/A");
            $("#staff-contact").text(field.contact || "N/A");
            $("#staff-email").text(field.email || "N/A");
            $("#staff-role").text(field.role || "N/A");
            $("#staff-field").text(field.fields?.[0]?.fieldCode|| "N/A");

        },
        error: (xhr, status, error) => {
            console.error("Error fetching crop details:", error);
            alert("Failed to fetch crop details. Please try again.");
        }
    });
}

document.getElementById("staffUpdateBtn").addEventListener("click", function () {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }
    // Collect input values
    const sid = $("#staff_upid").val();
    const sFirstname = $("#staff_upfirstName").val();
    const sLastname = $("#staff_uplastName").val();
    const sDesignation = $("#staff_upDesignation").val();
    const sGender = $("#staff_upGender").val();
    const sJoindate = $("#staff_upJoinDate").val();
    const sDob = $("#staff_upDob").val();
    const sContact = $("#staff_upContactNo").val();
    const sAddress = $("#staff_upAddress").val();
    const sEmail = $("#staff_upEmail").val();
    const sRole = $("#staff_upRole").val();
    const sField = $("#staff_upField").val();

    // Validate required fields
    if (
        !sid || !sFirstname || !sLastname || !sDesignation || !sGender || !sJoindate || !sDob ||
        !sContact || !sAddress || !sEmail || !sRole || !sField
    ) {
        alert("All fields are required!");
        return;
    }

    const fieldCodesArray = sField.split(",").map((code) => code.trim());


    // Create JSON object for the update payload
    const updateFieldDTO = {
        id: sid,
        firstName: sFirstname,
        lastName: sLastname,
        designation: sDesignation,
        gender: sGender,
        joinedDate: sJoindate,
        dob: sDob,
        contact: sContact,
        address: sAddress,
        email: sEmail,
        role: sRole,
        fieldCodes: sField // Assuming 'fieldCodes' is the field identifier
    };

    // Send the update request
    sendUpdateRequest(updateFieldDTO);
});

// Function to send the update request
function sendUpdateRequest(updateFieldDTO) {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/api/v1/staff/${updateFieldDTO.id}`,
        type: "PUT",
        contentType: "application/json", // Set content type as JSON
        data: JSON.stringify(updateFieldDTO),
        headers: {
            "Authorization": "Bearer " + token
        },// Convert data to JSON string
        success: function () {
            alert("Staff details updated successfully!");
            loadTable();
            document.getElementById("updateModal").style.display = "none"; // Close the modal
        },
        error: function (xhr) {
            console.error("Error:", xhr.responseText || xhr.statusText);
            alert(`Failed to update staff details. Error: ${xhr.responseText || xhr.statusText}`);
        },
    });
}

fieldIdGenerate();
function fieldIdGenerate() {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/staff", // API endpoint to fetch fields
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            // Validate the response is an array
            if (Array.isArray(response) && response.length > 0) {
                // Sort the array by fieldCode in ascending order (if necessary)
                response.sort((a, b) => a.id.localeCompare(b.id));

                // Get the last field in the sorted array
                const lastField = response[response.length - 1];

                // Validate that fieldCode exists and follows the expected format
                if (lastField && lastField.id) {
                    const lastFieldCode = lastField.id;

                    // Split the fieldCode using '-' and extract the numeric part
                    const lastIdParts = lastFieldCode.split('-');
                    if (lastIdParts.length === 2 && !isNaN(lastIdParts[1])) {
                        const lastNumber = parseInt(lastIdParts[1], 10);

                        // Generate the next ID
                        const nextId = `STAFF-${String(lastNumber + 1).padStart(4, '0')}`;
                        $("#staff_inpF1").val(nextId);
                        return;
                    }
                }
            }

            // If response is empty or no valid fieldCode found, set default value
            $("staff_inpF1").val("STAFF-0001");
        },
        error: function (xhr, status, error) {
            console.error("Error fetching last Field ID:", error);
            alert("Unable to fetch the last Field ID. Using default ID.");
            $("staff_inpF1").val("FIELD-0001"); // Set default ID in case of error
        }
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
