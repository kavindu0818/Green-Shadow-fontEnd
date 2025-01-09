
document.getElementById('mlm_addBtn').addEventListener('click',function (){
    document.getElementById('mlmForm').style.display='block';
    document.getElementById('mlm_viewDetails').style.display='none';
    document.getElementById('addIcon').style.display='block';
    document.getElementById('mlmTop').style.display='block';

});

const fieldCodeRegEx = /^LOG-[0-9]{4}$/;
const fieldNameRegEx = /^[A-Za-z ]{3,50}$/;


let fieldValidations = [
    { reg: fieldCodeRegEx, field: $("#mlm_inpF1"),  },
    { reg: fieldNameRegEx, field: $("#equ_inpF2"),  },

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
    $("#mlm_inpF1").attr("disabled", errorCount > 0);
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
    $("#equ_inpF1").on("keyup blur", checkFieldValidity);
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



loadMonitorTable()
function loadMonitorTable() {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }
    // Fetch data from the backend API
    $.ajax({
        url: "http://localhost:8080/api/v1/mlog",
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (response) => {
            try {
                if (Array.isArray(response)) {
                    populateVehicleTable(response); // Pass the response to populate the table
                } else {
                    console.error("Expected an array, but received:", response);
                    alert("Failed to load MonitorLog data. Invalid response format.");
                }
            } catch (error) {
                console.error("Error processing response:", error);
            }
        },
        error: (xhr, status, error) => {
            console.error("Error fetching MonitorLog data:", error);
            alert("Failed to load MonitorLog data. Please try again later.");
        }
    });
}

function populateVehicleTable(monitor) {
    try {
        const tableBody = $("#mlmTable tbody");
        tableBody.empty(); // Clear existing rows

        // Loop through each vehicle object and create table rows
        monitor.forEach((mon) => {
            const row = `
                <tr>
                    <td>${mon.logCode || "N/A"}</td>
                    <td>${mon.date || "N/A"}</td>
                    <td>${mon.observation || "N/A"}</td>
                   <td><img src="data:image/png;base64,${mon.observationImage}" alt="Crop Image" style="width: 50px; height: 50px;"></td>
                    <td class="action-icons">
                        <i class="fas fa-edit" title="Update" onclick="openUpdateVehicleModal('${mon.logCode || ""}')"></i>
                        <i class="fas fa-eye" title="View" onclick="viewVehicleDetails('${mon.logCode || ""}')"></i>
                        <i class="fas fa-trash-alt" title="Delete" onclick="deleteMonitor('${mon.logCode || ""}')"></i>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    } catch (e) {
        console.error("Error populating table:", e);
        alert("An error occurred while populating the table. Please try again.");
    }
}

function deleteMonitor(mlmCode) {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }
    if (confirm("Are you sure you want to delete this crop?")) {
        $.ajax({
            url: `http://localhost:8080/api/v1/mlog/${mlmCode}`, // API endpoint to delete crop
            type: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (response) {
                alert("Log deleted successfully.");
                loadMonitorTable();
                // Remove the specific row using a unique identifier
                $(`#mlmTable tbody tr`).filter(function () {
                    return $(this).find("td").eq(0).text().trim() === cropCode; // Match the first <td> (Crop ID)
                }).remove();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting crop:", error);
                alert("Failed to delete the Log. Please try again.");
            }
        });
    }
}


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
                $("#mlm_inpF5").empty();

                // Populate the dropdown with fieldCodes
                response.forEach(function (field) {
                    if (field.fieldCode) { // Ensure fieldCode exists
                        $("#mlm_inpF5").append(
                            `<option value="${field.fieldCode}">${field.fieldCode}</option>`
                        );
                    }
                });

                // If no valid fieldCode found, set default option
                if ($("#mlm_inpF5").children().length === 0) {
                    $("#mlm_inpF5").append(
                        `<option value="FIELD-0001">FIELD-0001</option>`
                    );
                }
            } else {
                console.warn("Invalid response format. Setting default field ID.");
                $("#mlm_inpF5").html(
                    `<option value="FIELD-0001">FIELD-0001</option>`
                );
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching fields:", error);
            alert("Unable to fetch fields. Using default field ID.");
            $("#mlm_inpF5").html(
                `<option value="FIELD-0001">FIELD-0001</option>`
            );
        }
    });
}

setCropId();
function setCropId() {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }


    $.ajax({
        url: "http://localhost:8080/api/v1/crop", // API endpoint to fetch fields
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            if (Array.isArray(response)) {
                // Clear existing options
                $("#mlm_inpF4").empty();

                // Populate the dropdown with fieldCodes
                response.forEach(function (crop) {
                    if (crop.cropCode) { // Ensure fieldCode exists
                        $("#mlm_inpF4").append(
                            `<option value="${crop.cropCode}">${crop.cropCode}</option>`
                        );
                    }
                });

                // If no valid fieldCode found, set default option
                if ($("#mlm_inpF4").children().length === 0) {
                    $("#mlm_inpF4").append(
                        `<option value="FIELD-0001">FIELD-0001</option>`
                    );
                }
            } else {
                console.warn("Invalid response format. Setting default field ID.");
                $("#mlm_inpF4").html(
                    `<option value="CROP-0001">FIELD-0001</option>`
                );
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching fields:", error);
            alert("Unable to fetch fields. Using default field ID.");
            $("#mlm_inpF4").html(
                `<option value="CROP-0001">CROP-0001</option>`
            );
        }
    });
}

setStaffId();
function setStaffId() {

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
            if (Array.isArray(response)) {
                // Clear existing options
                $("#mlm_inpF3").empty();

                // Populate the dropdown with fieldCodes
                response.forEach(function (staff) {
                    if (staff.id) { // Ensure fieldCode exists
                        $("#mlm_inpF3").append(
                            `<option value="${(staff.id)}">${(staff.id)}</option>`
                        );
                    }
                });

                // If no valid fieldCode found, set default option
                if ($("#mlm_inpF3").children().length === 0) {
                    $("#mlm_inpF3").append(
                        `<option value="STAFF-0001">STAFF-0001</option>`
                    );
                }
            } else {
                console.warn("Invalid response format. Setting default field ID.");
                $("#mlm_inpF3").html(
                    `<option value="STAFF-0001">STAFF-0001</option>`
                );
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching fields:", error);
            alert("Unable to fetch fields. Using default field ID.");
            $("#mlm_inpF3").html(
                `<option value="STAFF-0001">STAFF-0001</option>`
            );
        }
    });
}

$("#mlm_subBtn").on('click', function () {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found");
        return;
    }

    const logCode = $("#mlm_inpF1").val();
    let logDateString = $("#mlm_inpF2").val(); // Example input: "2024-12-06"
    let logDate = new Date(logDateString);
    const logDetails = $("#mlm_inpF7").val();
    const logField = $("#mlm_inpF5").val();
    const logCrop = $("#mlm_inpF4").val();
    const logStaff = $("#mlm_inpF3").val();
    const logImage = $("#mlm_inpF6")[0].files[0]; // Get the file from the input


    if (isNaN(logDate)) {
        alert("Invalid date format. Please use yyyy-MM-dd.");
        return;
    }

    const formData = new FormData();
    formData.append("logCode", logCode);
    formData.append("date", logDate);
    formData.append("observation", logDetails);
    formData.append("observationImage", logImage);
    formData.append("fieldCode", logField);
    formData.append("cropId", logCrop);
    formData.append("staffId", logStaff);


    $.ajax({
        url: "http://localhost:8080/api/v1/mlog",
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (response) => {
            console.log("MonitorLog added successfully:", response);
            alert("MonitorLog added successfully!");
            clearFields();
            MonitorIdGenerate();
            loadMonitorTable();
        },
        error: (xhr, status, error) => {
            console.error("Error adding monitorLog:", xhr.responseText || error);
            if (xhr.responseText) {
                alert("Failed to add MonitorLog: " + xhr.responseText);
            } else {
                alert("Failed to add MonitorLog. Please try again.");
            }
        }
    });
});


    function MonitorIdGenerate() {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/mlog",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            try {

                if (Array.isArray(response) && response.length > 0) {

                    response.sort((a, b) => a.logCode.localeCompare(b.logCode));

                    const lastLog = response[response.length - 1];

                    if (lastLog && lastLog.logCode) {
                        const lastLogCode = lastLog.logCode;

                        const logParts = lastLogCode.split('-');
                        if (logParts.length === 2 && !isNaN(logParts[1])) {
                            const lastNumber = parseInt(logParts[1], 10);
                            const nextId = `LOG-${String(lastNumber + 1).padStart(4, '0')}`;
                            $("#mlm_inpF1").val(nextId);
                            return;
                        }
                    }
                }

                $("#mlm_inpF1").val("LOG-0001");
            } catch (error) {
                console.error("Error processing response:", error);
                $("#mlm_inpF1").val("LOG-0001");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching last log ID:", error);
            alert("Unable to fetch the last log ID. Using default ID.");
            $("#mlm_inpF1").val("LOG-0001");
        }
    });
}



MonitorIdGenerate();

function openUpdateVehicleModal(mlmCode) {
    document.getElementById("updateModal").style.display = "block";

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/api/v1/mlog/${mlmCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (mlm) => {
            if (!mlm) {
                alert("No data found for the selected field.");
                return;
            }

            $("#mlm_upCode").val(mlm.logCode);
            $("#mlm_upName").val(mlm.date);
            $("#mlm_upStaff").val(mlm.staffId?.id || "N/A");
            $("#mlm_upField").val(mlm.fieldEntityDto?.fieldCode|| "N/A");
            $("#mlm_upCrop").val(mlm.cropId?.cropCode || "N/A");
            $("#mlm_upDetails").val(mlm.observation || "N/A");
            $("#mlm_upImage").html(`<img src="data:image/png;base64,${mlm.observationImage}" alt="Crop Image" style="width: 150px; height: 100px;">`);


            $("#fileInput").val("");
        },
        error: (xhr, status, error) => {
            console.error("Error fetching field deails:", error);
            alert("Failed to fetch field details. Please try again.");
        }
    });
}

function viewVehicleDetails(logCode) {

    document.getElementById("viewModal").style.display = "block";

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/api/v1/mlog/${logCode}`,
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (mlm) => {

            console.log("MONITORLOGIN" + mlm)
            if (!mlm) {
                alert("No data found for the selected Equipment.");
                return;
            }
            $("#mlm_code").text(mlm.logCode);
            $("#mlm_name").text(mlm.date);
            $("#mlm_sfatt").text(mlm.staffId?.id || "N/A");
            $("#mlm_crop").text(mlm.cropId?.cropCode || "N/A");
            $("#mlm_field").text(mlm.fieldEntityDto?.fieldCode|| "N/A");
            $("#mlm_details").text(mlm.observation || "N/A");
            $("#mlm_Image").html(`<img src="data:image/png;base64,${mlm.observationImage}" alt="Crop Image" style="width: 150px; height: 100px;">`);

            console.log(mlm)

        },
        error: (xhr, status, error) => {
            console.error("Error fetching crop details:", error);
            alert("Failed to fetch crop details. Please try again.");
        }
    });
}

document.getElementById("mlmUpdateBtn").addEventListener("click", async function () {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
        alert("No token found");
        return;
    }

    const logCode = document.getElementById("mlm_upCode").value;
    const logDate = document.getElementById("mlm_upName").value;
    const logDetails = document.getElementById("mlm_upDetails").value;
    const logField = document.getElementById("mlm_upField").value;
    const logCrop = document.getElementById("mlm_upCrop").value;
    const logStaff = document.getElementById("mlm_upStaff").value;
    const monitorImage = document.getElementById("fileInput").files[0];
    const logImage = document.querySelector("#mlm_upImage img").src;


    if (!logCode || !logDate || !logDetails || !logField || !logCrop || !logStaff) {
        alert("Please fill out all required fields.");
        return;
    }

    if (!monitorImage && !logImage) {
        alert("Please upload an observation image.");
        return;
    }

    const payload = {
        logCode: logCode,
        date: logDate,
        observation: logDetails,
        fieldId: logField,
        cropId: logCrop,
        staffId: logStaff,
        observationImage: monitorImage
            ? await toBase64(monitorImage)
            : logImage.replace(/^data:image\/[a-z]+;base64,/, ""),
    };

    // Send the JSON payload
    try {
        const response = await fetch(`http://localhost:8080/api/v1/mlog/${logCode}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log("MonitorLog updated successfully");
            alert("MonitorLog updated successfully!");
            clearFields();
            MonitorIdGenerate();
        } else {
            const errorText = await response.text();
            console.error("Error updating MonitorLog:", errorText);
            alert(`Failed to update MonitorLog: ${errorText || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error updating MonitorLog:", error);
        alert(`Failed to update MonitorLog: ${error.message}`);
    }
});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]); // Exclude "data:image/png;base64," prefix
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {

            const imageData = e.target.result;
            $("#mlm_upImage").html(
                `<img src="${imageData}" alt="Updated Crop Image" style="width: 100px; height: 80px;">`
            );
        };
        reader.readAsDataURL(file);
    }
});

 $(document).ready(function () {
        $("#mlm_sbar").on("keyup", function () {
            const searchValue = $(this).val().toLowerCase();

            $("#mlmTable tbody tr").each(function () {
                const rowText = $(this).text().toLowerCase();
                $(this).toggle(rowText.indexOf(searchValue) > -1);
            });
        });
    });







