
document.getElementById('veh_addBtn').addEventListener('click',function (){
    document.getElementById('vehForm').style.display='block';
    document.getElementById('veh_viewDetails').style.display='none';
    document.getElementById('addIcon').style.display='block';
    document.getElementById('vehTop').style.display='block';

});
document.getElementById("VehUpdateBtn").addEventListener("click", function () {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

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
        url: `http://localhost:8080/api/v1/veh/${formData.code}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(formData),
        headers: {
            "Authorization": "Bearer " + token
        },
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

    function loadTable() {

        const token = localStorage.getItem("token");
        console.log(token)
        if (!token) {
            alert("No token found");
            return;
        }
        // Fetch data from the backend API
        $.ajax({
            url: "http://localhost:8080/api/v1/veh",
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
                        alert("Failed to load vehicle data. Invalid response format.");
                    }
                } catch (error) {
                    console.error("Error processing response:", error);
                }
            },
            error: (xhr, status, error) => {
                console.error("Error fetching vehicle data:", error);
                alert("Failed to load vehicle data. Please try again later.");
            }
        });
    }

    function populateVehicleTable(vehicle) {
        try {
            const tableBody = $("#vehTable tbody");
            tableBody.empty(); // Clear existing rows

            // Loop through each vehicle object and create table rows
            vehicle.forEach((veh) => {
                const row = `
                <tr>
                    <td>${veh.code || "N/A"}</td>
                    <td>${veh.licensePlateNum || "N/A"}</td>
                    <td>${veh.category || "N/A"}</td>
                    <td>${veh.fuelType || "N/A"}</td>
                    <td class="action-icons">
                        <i class="fas fa-edit" title="Update" onclick="openUpdateVehicleModal('${veh.code || ""}')"></i>
                        <i class="fas fa-eye" title="View" onclick="viewVehicleDetails('${veh.code || ""}')"></i>
                        <i class="fas fa-trash-alt" title="Delete" onclick="deleteField('${veh.code || ""}')"></i>
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

    // Call the function to load the table on page load or as needed
    loadTable();


fieldIdGenerate();
    $("#veh_subBtn").on('click', function () {

        const token = localStorage.getItem("token");
        console.log(token)
        if (!token) {
            alert("No token found");
            return;
        }
        // Get values from input fields
        var code = $("#veh_inpF1").val();
        var liPlateNum = $("#veh_inpF2").val();
        var vehCat = $("#veh_inpF3").val();
        var fuelType = $("#veh_inpF4").val();
        var status = $("#veh_inpF5").val();
        var staff = $("#veh_inpF6").val(); // Correct variable for staff
        var remarks = $("#veh_inpF7").val();

        // Create a FormData object for file upload
        var formData = new FormData();
        formData.append("code", code);
        formData.append("licensePlateNum", liPlateNum);
        formData.append("category", vehCat);
        formData.append("fuelType", fuelType);
        formData.append("status", status);
        formData.append("remarks", remarks);
        formData.append("staffId", staff); // Corrected to send the staffId field

        // Send AJAX POST request to the backend
        $.ajax({
            url: "http://localhost:8080/api/v1/veh", // Backend endpoint
            type: "POST",
            processData: false,
            contentType: false,
            data: formData,
            headers: {
                "Authorization": "Bearer " + token
            },// Form data with fields
            success: (response) => {
                console.log("Vehicle added successfully:", response);
                alert("Vehicle added successfully!");
                clearFields();
                fieldIdGenerate(); // Clear input fields after success
            },
            error: (error) => {
                console.error("Error adding vehicle:", error);
                alert("Failed to add vehicle. Please try again.");
            }
        });
    });




// Function to clear input fields
function clearFields() {
    $("#inpFe1").val('');
    $("#inpFe2").val('');
    $("#inpFe3").val('');
    $("#inpFe5").val('');
    $("#inpFe4").val('');
    // $("#inpF7").val('');
    // $("#inpF4").val('');
}

function fieldIdGenerate() {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }
    $.ajax({
        url: "http://localhost:8080/api/v1/veh", // API endpoint to fetch fields
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (response) {
            // Validate the response is an array
            if (Array.isArray(response) && response.length > 0) {
                // Sort the array by fieldCode in ascending order (if necessary)
                response.sort((a, b) => a.code.localeCompare(b.code));

                // Get the last field in the sorted array
                const lastField = response[response.length - 1];

                // Validate that fieldCode exists and follows the expected format
                if (lastField && lastField.code) {
                    const lastFieldCode = lastField.code;

                    // Split the fieldCode using '-' and extract the numeric part
                    const lastIdParts = lastFieldCode.split('-');
                    if (lastIdParts.length === 2 && !isNaN(lastIdParts[1])) {
                        const lastNumber = parseInt(lastIdParts[1], 10);

                        // Generate the next ID
                        const nextId = `VEH-${String(lastNumber + 1).padStart(4, '0')}`;
                        $("#veh_inpF1").val(nextId);
                        return;
                    }
                }
            }

            // If response is empty or no valid fieldCode found, set default value
            $("#veh_inpF1").val("VEH-0001");
        },
        error: function (xhr, status, error) {
            console.error("Error fetching last Field ID:", error);
            alert("Unable to fetch the last Field ID. Using default ID.");
            $("#inpFe1").val("FIELD-0001"); // Set default ID in case of error
        }
    });
}

function deleteField(vehCode) {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    if (confirm("Are you sure you want to delete this Field?")) {
        $.ajax({
            url: `http://localhost:8080/api/v1/veh/${vehCode}`, // API endpoint to delete crop
            type: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            },
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

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/api/v1/veh/${vehCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
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

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: `http://localhost:8080/api/v1/veh/${vehCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
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


