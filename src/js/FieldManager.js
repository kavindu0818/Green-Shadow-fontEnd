document.getElementById('field_subBtn').addEventListener('click', function () {
    // Show the overlay
    document.getElementById('overlay').style.display = 'flex';

    // Simulate a delay (e.g., for form submission) and then hide the overlay
    setTimeout(() => {
        document.getElementById('overlay').style.display = 'none';
    }, 3000); // Adjust delay as needed
});

document.getElementById('FieldaddBtn').addEventListener('click',function (){
    document.getElementById('fieldForm').style.display='block';
    document.getElementById('viewDetails').style.display='none';
    document.getElementById('imgfield').style.display='block';
    document.getElementById('fieldTop').style.display='block';

});

function openModal() {
    document.getElementById("fieldviewModal").style.display = "block";
}

function openUpdateModal() {
    document.getElementById("field_updateModal").style.display = "block";
}
function closeModal() {
    document.getElementById("fieldviewModal").style.display = "none";
}

function upcloseModal() {
    document.getElementById("field_updateModal").style.display = "none";
}


// Close modal if user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById("fieldviewModal");
    if (event.target == modal) {
        closeModal();
    }
}

window.onclick = function(event) {
    const modal = document.getElementById("field_updateModal");
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
            const imageUpdateView = document.getElementById('field_imageUpdateView');
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
        url: "http://localhost:5050/green/api/v1/field",
        type: "GET",
        contentType: "application/json",
        success: (response) => {
           console.log(response)
            let fieldsArray;
            try {
                populateCropTable(response)
            } catch (error) {
                console.error("Invalid JSON response:", response);
                return;
            }

            // Iterate over the array and populate the table
            fieldsArray.forEach((item) => {
                const row = `
                <tr>
                <td>${item.fieldCode}</td>
                <td>${item.fieldName}</td>
                <td>${item.fieldLocation}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary mx-2" onclick="editField('${item.id}')">Edit</button>
                    <button class="btn btn-sm btn-outline-danger mx-2" onclick="deleteField('${item.id}')">Delete</button>
                </td>
            </tr>`;
                $('#fieldTable tbody').append(row);
            });
        },
        error: (xhr, status, error) => {
            console.error("Error fetching data:", error);
            alert("Failed to load data. Please try again.");
        }
    });
}
function populateCropTable(field) {

    console.log(field)
    try {
        const tableBody = $("#fieldTable tbody");
        tableBody.empty(); // Clear existing rows

        field.forEach((field) => {
            const row = `
                <tr>
                    <td>${field.fieldCode}</td>
                    <td>${field.fieldName}</td>
                    <td>${field.fieldLocation}</td>
                    <td><img src="data:image/png;base64,${field.fieldImage}" alt="Crop Image" style="width: 50px; height: 50px;"></td>
                    <td class="action-icons">
                        <i class="fas fa-edit" title="Update" onclick="openUpdateFieldModal('${field.fieldCode}')"></i>
                        <i class="fas fa-eye" title="View" onclick="viewCropDetails('${field.fieldCode}')"></i>
                        <i class="fas fa-trash-alt" title="Delete" onclick="deleteField('${field.fieldCode}')"></i>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    } catch (e) {
        console.error("Error populating table:", e);
    }
}

fieldIdGenerate();
$("#field_subBtn").on('click', function() {
    // Get values from input fields
    var code = $("#inpFe1").val();
    var fieldName = $("#inpFe2").val();
    var fieldLocation = $("#inpFe3").val();
    var fieldSize = $("#inpFe5").val();
    var cropSeason = $("#inpField6").val();
    var cropField = $("#inpFe7").val();

    // Collect file input
    var fieldImage = $("#inpFe4")[0].files[0];

    // Create a FormData object for file upload
    var formData = new FormData();
    formData.append("fieldCode", code);
    formData.append("fieldName", fieldName);
    formData.append("fieldLocation", fieldLocation);
    formData.append("fieldSize", fieldSize);
    formData.append("fieldImage", fieldImage);
    // formData.append("season", cropSeason);
    // formData.append("field_code", cropField); // Corrected the name to field_code

    // Send AJAX POST request to the backend
    $.ajax({
        url: "http://localhost:5050/green/api/v1/field", // Backend endpoint
        type: "POST",
        processData: false,
        contentType: false,
        data: formData, // Form data with fields and file
        success: (response) => {
            console.log("Field added successfully:", response);
            alert("Field added successfully!");
            clearFields();
            fieldIdGenerate(); // Clear input fields after success
        },
        error: (error) => {
            console.error("Error adding Field:", error);
            alert("Failed to add field. Please try again.");
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
    $.ajax({
        url: "http://localhost:5050/green/api/v1/field", // API endpoint to fetch fields
        type: "GET",
        success: function (response) {
            // Validate the response is an array
            if (Array.isArray(response) && response.length > 0) {
                // Sort the array by fieldCode in ascending order (if necessary)
                response.sort((a, b) => a.fieldCode.localeCompare(b.fieldCode));

                // Get the last field in the sorted array
                const lastField = response[response.length - 1];

                // Validate that fieldCode exists and follows the expected format
                if (lastField && lastField.fieldCode) {
                    const lastFieldCode = lastField.fieldCode;

                    // Split the fieldCode using '-' and extract the numeric part
                    const lastIdParts = lastFieldCode.split('-');
                    if (lastIdParts.length === 2 && !isNaN(lastIdParts[1])) {
                        const lastNumber = parseInt(lastIdParts[1], 10);

                        // Generate the next ID
                        const nextId = `FIELD-${String(lastNumber + 1).padStart(4, '0')}`;
                        $("#inpFe1").val(nextId);
                        return;
                    }
                }
            }

            // If response is empty or no valid fieldCode found, set default value
            $("#inpFe1").val("FIELD-0001");
        },
        error: function (xhr, status, error) {
            console.error("Error fetching last Field ID:", error);
            alert("Unable to fetch the last Field ID. Using default ID.");
            $("#inpFe1").val("FIELD-0001"); // Set default ID in case of error
        }
    });
}

function deleteField(fieldCode) {
    if (confirm("Are you sure you want to delete this Field?")) {
        $.ajax({
            url: `http://localhost:5050/green/api/v1/field/${fieldCode}`, // API endpoint to delete crop
            type: "DELETE",
            success: function (response) {
                alert("Crop deleted successfully.");
                // Remove the specific row using a unique identifier
                $(`#fieldTable tbody tr`).filter(function () {
                    return $(this).find("td").eq(0).text().trim() === fieldCode; // Match the first <td> (Crop ID)
                }).remove();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting crop:", error);
                alert("Failed to delete the crop. Please try again.");
            }
        });
    }
}

function openUpdateFieldModal(fieldCode) {
    document.getElementById("field_updateModal").style.display = "block";

    $.ajax({
        url: `http://localhost:5050/green/api/v1/field/${fieldCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        success: (field) => {
            if (!field) {
                alert("No data found for the selected field.");
                return;
            }
            // Populate the details section with the fetched crop data
            $("#upFCode").val(field.fieldCode);
            $("#upFName").val(field.fieldName);
            $("#upFlocation").val(field.fieldLocation || "N/A");
            $("#upFsize").val(field.fieldSize || "N/A");

            // Display the image (in a separate div or img tag)
            $("#imageUpdateFieldView").html(
                `<img src="data:image/png;base64,${field.fieldImage}" alt="Crop Image" style="width: 130px; height: 80px;">`
            );

            // Clear any previously selected file from the file input
            $("#fileInput").val("");
        },
        error: (xhr, status, error) => {
            console.error("Error fetching field deails:", error);
            alert("Failed to fetch field details. Please try again.");
        }
    });
}

function viewCropDetails(fieldCode) {

    document.getElementById("fieldviewModal").style.display = "block";

    $.ajax({
        url: `http://localhost:5050/green/api/v1/field/${fieldCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        success: (field) => {
            if (!field) {
                alert("No data found for the selected field.");
                return;
            }
            $("#viewFieldCode").text(field.fieldCode);
            $("#viewFieldName").text(field.fieldName);
            $("#viewFieldLocation").text(field.fieldLocation || "N/A");
            $("#viewFieldSize").text(field.fieldSize || "N/A");

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

$(document).ready(function () {
    // Attach a keyup event listener to the search bar
    $("#Fieldsbar").on("keyup", function () {
        const searchValue = $(this).val().toLowerCase(); // Get the search value and convert to lowercase

        // Loop through the table rows
        $("#fieldTable tbody tr").filter(function () {
            // Show or hide rows based on the search value
            $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1);
        });
    });
});

document.getElementById("field_cropUpdateBtn").addEventListener("click", function () {
    var fieldCode = $("#upFCode").val();
    var fieldName = $("#upFName").val();
    var fieldLocation = $("#upFlocation").val();
    var fieldSize = $("#upFsize").val();
    // var season = $("#upSea").val();
    // var field = $("#upField").val();

    // Check if a new image is selected
    var fieldImage = $("#fieldFileInput")[0].files[0];

    // If no new image is selected, use the currently displayed image
    var imageBase64 = $("#imageUpdateFieldView img").attr("src");

    if (!fieldCode || !fieldName || !fieldLocation ||  !fieldSize || !field) {
        alert("All fields except the image are required!");
        return;
    }

    const formData = new FormData();
    formData.append("fieldCode", fieldCode);
    formData.append("fieldName", fieldName);
    formData.append("fieldLocation", fieldLocation);
    formData.append("fieldSize", fieldSize);
    // Attach the image data
    if (fieldImage) {
        formData.append("fieldImage", fieldImage); // New image file
    } else if (imageBase64) {
        // Convert base64 string to Blob and attach it
        const blob = base64ToBlob(imageBase64);
        formData.append("fieldImage", blob, "existing-image.png");
    } else {
        alert("No image provided!");
        return;
    }

    updateCropDetails(fieldCode, formData);
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

// Listen for file input change and update the preview
document.getElementById("fieldFileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Display the new image in the update modal
            const imageData = e.target.result;
            $("#imageUpdateFieldView").html(
                `<img src="${imageData}" alt="Updated Crop Image" style="width: 100px; height: 80px;">`
            );
        };
        reader.readAsDataURL(file); // Convert file to base64 string
    }
});

function updateCropDetails(fieldCode, formData) {
    $.ajax({
        url: `http://localhost:5050/green/api/v1/field/${fieldCode}`, // API endpoint for updating crop
        type: "PUT",
        processData: false,
        contentType: false,
        data: formData,
        success: function (data) {
            console.log("Success:", data);
            alert("Field updated successfully!");
        },
        error: function (xhr, status, error) {
            console.error("Error response:", xhr.responseText || error);
            alert(`Failed to update field details. Error: ${xhr.responseText || error}`);
        },
    });
}



