
document.getElementById('mlm_addBtn').addEventListener('click',function (){
    document.getElementById('mlmForm').style.display='block';
    document.getElementById('mlm_viewDetails').style.display='none';
    document.getElementById('addIcon').style.display='block';
    document.getElementById('mlmTop').style.display='block';

});
document.getElementById("mlmUpdateBtn").addEventListener("click", function () {
    const vehCode = $("#veh_upCode").val();
    const vehPlatNum = $("#veh_upPlateNumber").val();
    const vehCat = $("#veh_upCategory").val();
    const vehFuel = $("#veh_upFuelType").val();
    const vehStatus = $("#veh_upStatus").val();
    const vehStaff = $("#veh_upStaffNum").val();
    const vehRemark = $("#veh_upRemarks").val();

    if (!vehCode || !vehPlatNum || !vehCat || !vehFuel || !vehStatus || !vehStaff || !vehRemark) {
        alert("All fields are required!");
        return;
    }

    const formData = {
        code: vehCode,
        licensePlateNum: vehPlatNum,
        category: vehCat,
        fuelType: vehFuel,
        status: vehStatus,
        remarks: vehRemark,
        staffId: vehStaff,
    };

    console.log("Form data:", formData);

    $.ajax({
        url: `http://localhost:5050/green/api/v1/veh/${formData.code}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function () {
            alert("Vehicle details updated successfully!");
            document.getElementById("updateModal").style.display = "none";
        },
        error: function (xhr) {
            console.error("Error:", xhr.responseText || xhr.statusText);
            alert(`Failed to update vehicle details. Error: ${xhr.responseText || xhr.statusText}`);
        },
    });
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

loadMonitorTable()
function loadMonitorTable() {
    // Fetch data from the backend API
    $.ajax({
        url: "http://localhost:5050/green/api/v1/mlog",
        type: "GET",
        contentType: "application/json",
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
                        <i class="fas fa-trash-alt" title="Delete" onclick="deleteField('${mon.logCode || ""}')"></i>
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

fieldIdGenerate();
$("#mlm_subBtn").on('click', function() {
        // Get values from input fields
        var logCode = $("#mlm_inpF1").val();
        var logDate = $("#mlm_inpF2").val();
        var logDetails = $("#mlm_inpF7").val();
        var logField = $("#mlm_inpF5").val();
        var logCrop = $("#mlm_inpF4").val();
        var logStaff = $("#mlm_inpF3").val();

        // Collect file input
        var logImage = $("#mlm_inpF6")[0].files[0];

        // Validate required inputs
        if (!logCode || !logDate || !logDetails || !logField || !logCrop || !logStaff) {
            alert("Please fill out all required fields.");
            return;
        }

        if (!logImage) {
            alert("Please upload an observation image.");
            return;
        }

        // Create a FormData object for file upload
        var formData = new FormData();
        formData.append("logCode", logCode);
        formData.append("date", logDate);
        formData.append("observation", logDetails);
        formData.append("observationImage", logImage);
        formData.append("fieldCode", logField); // Ensure this matches your backend parameter
        formData.append("cropCode", logCrop); // Ensure this matches your backend parameter
        formData.append("staffId", logStaff);

        // Send AJAX POST request to the backend
        $.ajax({
            url: "http://localhost:5050/green/api/v1/mlog", // Backend endpoint
            type: "POST",
            processData: false,
            contentType: false,
            data: formData,
            success: (response) => {
                console.log("MonitorLog added successfully:", response);
                alert("MonitorLog added successfully!");
                clearFields();
                MonitorIdGenerate(); // Generate the next ID
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

// Function to clear input fields
function clearFields() {

    $("#mlm_inpF1").val('');
    $("#mlm_inpF2").val('');
    $("#mlm_inpF7").val('');
    $("#mlm_inpF6").val('');

}

function MonitorIdGenerate() {
    $.ajax({
        url: "http://localhost:5050/green/api/v1/mlog", // API endpoint to fetch logs
        type: "GET",
        success: function (response) {
            try {
                // Validate response as an array
                if (Array.isArray(response) && response.length > 0) {
                    // Sort by logCode in ascending order
                    response.sort((a, b) => a.logCode.localeCompare(b.logCode));

                    // Get the last log from the sorted array
                    const lastLog = response[response.length - 1];

                    // Check if logCode exists and follows the expected format
                    if (lastLog && lastLog.logCode) {
                        const lastLogCode = lastLog.logCode;

                        // Split the logCode by '-' and extract the numeric part
                        const logParts = lastLogCode.split('-');
                        if (logParts.length === 2 && !isNaN(logParts[1])) {
                            const lastNumber = parseInt(logParts[1], 10);

                            // Generate the next ID
                            const nextId = `LOG-${String(lastNumber + 1).padStart(4, '0')}`;
                            $("#mlm_inpF1").val(nextId);
                            return; // Successfully generated ID
                        }
                    }
                }

                // If response is empty or logCode is invalid, set default ID
                $("#mlm_inpF1").val("LOG-0001");
            } catch (error) {
                console.error("Error processing response:", error);
                $("#mlm_inpF1").val("LOG-0001"); // Fallback to default ID
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching last log ID:", error);
            alert("Unable to fetch the last log ID. Using default ID.");
            $("#mlm_inpF1").val("LOG-0001"); // Fallback to default ID
        }
    });
}


MonitorIdGenerate();
function deleteField(vehCode) {
    if (confirm("Are you sure you want to delete this Field?")) {
        $.ajax({
            url: `http://localhost:5050/green/api/v1/veh/${vehCode}`, // API endpoint to delete crop
            type: "DELETE",
            success: function (response) {
                alert("Vehicle deleted successfully.");
                loadTable();
                // Remove the specific row using a unique identifier
                $(`#vehTable tbody tr`).filter(function () {
                    return $(this).find("td").eq(0).text().trim() === vehCode; // Match the first <td> (Crop ID)
                }).remove();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting Vehicle:", error);
                alert("Failed to delete the crop. Please try again.");
            }
        });
    }
}

function openUpdateVehicleModal(vehCode) {
    document.getElementById("updateModal").style.display = "block";

    $.ajax({
        url: `http://localhost:5050/green/api/v1/veh/${vehCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        success: (veh) => {
            if (!veh) {
                alert("No data found for the selected field.");
                return;
            }
            // Populate the details section with the fetched crop data
            $("#veh_upCode").val(veh.code);
            $("#veh_upPlateNumber").val(veh.licensePlateNum);
            $("#veh_upCategory").val(veh.category || "N/A");
            $("#veh_upFuelType").val(veh.fuelType || "N/A");
            $("#veh_upStatus").val(veh.status || "N/A");
            $("#veh_upStaffNum").val(veh.staffId || "N/A");
            $("#veh_upRemarks").val(veh.remarks || "N/A");

            // Display the image (in a separate div or img tag

            // Clear any previously selected file from the file input
            $("#fileInput").val("");
        },
        error: (xhr, status, error) => {
            console.error("Error fetching field deails:", error);
            alert("Failed to fetch field details. Please try again.");
        }
    });
}

function viewVehicleDetails(vehCode) {

    document.getElementById("viewModal").style.display = "block";

    $.ajax({
        url: `http://localhost:5050/green/api/v1/veh/${vehCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        success: (veh) => {
            if (!veh) {
                alert("No data found for the selected field.");
                return;
            }
            $("#veh_code").text(veh.code);
            $("#veh_plateNum").text(veh.licensePlateNum);
            $("#veh_cat").text(veh.category || "N/A");
            $("#veh_fuel").text(veh.fuelType || "N/A");
            $("#veh_status").text(veh.status || "N/A");
            $("#veh_staff").text(veh.staffId || "N/A");
            $("#veh_remark").text(veh.remarks || "N/A");

            // Display the image (in a separate div or img ta
        },
        error: (xhr, status, error) => {
            console.error("Error fetching crop details:", error);
            alert("Failed to fetch crop details. Please try again.");
        }
    });
}

$(document).ready(function () {
    // Attach a keyup event listener to the search bar
    $("#veh_sbar").on("keyup", function () {
        const searchValue = $(this).val().toLowerCase(); // Get the search value and convert to lowercase

        // Loop through the table rows
        $("#vehTable tbody tr").filter(function () {
            // Show or hide rows based on the search value
            $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1);
        });
    });
});

// Add event listener to update the image preview when a new file is selected
document.getElementById("fieldFileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            $("#imageUpdateFieldView").html(
                `<img src="${imageData}" alt="Updated Crop Image" style="width: 100px; height: 80px;">`
            );
        };
        reader.readAsDataURL(file);
    }
});
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


