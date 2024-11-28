document.getElementById('subBtn').addEventListener('click', function () {
    // Show the overlay
    document.getElementById('overlay').style.display = 'flex';

    // Simulate a delay (e.g., for form submission) and then hide the overlay
    setTimeout(() => {
        document.getElementById('overlay').style.display = 'none';
    }, 3000); // Adjust delay as needed
});

document.getElementById('addBtn').addEventListener('click',function (){
    document.getElementById('cropForm').style.display='block';
    document.getElementById('viewDetails').style.display='none';
    document.getElementById('imgPlant').style.display='block';
    document.getElementById('cropTop').style.display='block';

});

function viewCropDetails(cropCode) {

    document.getElementById("viewModal").style.display = "block";

    $.ajax({
        url: `http://localhost:5050/green/api/v1/crop/${cropCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        success: (crop) => {
            if (!crop) {
                alert("No data found for the selected crop.");
                return;
            }

            // const fieldId = crop.fieldEntity.fieldCode;
            // Populate the details section with the fetched crop data
            $("#cropCode").text(crop.cropCode);
            $("#comName").text(crop.commonName);
            $("#csiName").text(crop.scientificName || "N/A");
            $("#cropCat").text(crop.category || "N/A");
            $("#cropSeason").text(crop.season || "N/A");
            $("#cropField").text(crop.field || "N/A");
            $("#imageView").html(`<img src="data:image/png;base64,${crop.image}" alt="Crop Image" style="width: 150px; height: 100px;">`);
        },
        error: (xhr, status, error) => {
            console.error("Error fetching crop details:", error);
            alert("Failed to fetch crop details. Please try again.");
        }
    });
}

function openUpdateModal(cropCode) {
    document.getElementById("updateModal").style.display = "block";

    $.ajax({
        url: `http://localhost:5050/green/api/v1/crop/${cropCode}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        success: (crop) => {
            if (!crop) {
                alert("No data found for the selected crop.");
                return;
            }
            // Populate the details section with the fetched crop data
            $("#upCode").val(crop.cropCode);
            $("#upName").val(crop.commonName);
            $("#upsName").val(crop.scientificName || "N/A");
            $("#upCat").val(crop.category || "N/A");
            $("#upSea").val(crop.season || "N/A");
            $("#upField").val(crop.field || "N/A");

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


// Handle file input for image update
document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Display the new image in the update modal
            const imageData = e.target.result;
            $("#imageUpdateView").html(
                `<img src="${imageData}" alt="Updated Crop Image" style="width: 150px; height: 80px;">`
            );
        };
        reader.readAsDataURL(file); // Convert file to base64 string
    }
});

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

document.getElementById("changeImage").addEventListener("click", function () {
    // Trigger the hidden file input
    document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
        const reader = new FileReader();

        // When the file is loaded, display it inside the div
        reader.onload = function (e) {
            const imageUpdateView = document.getElementById("imageUpdateView");
            imageUpdateView.innerHTML = ''; // Clear any existing content
            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.maxWidth = "100%"; // Adjust style as needed
            img.style.maxHeight = "100%"; // Adjust style as needed
            imageUpdateView.appendChild(img);
        };

        reader.readAsDataURL(file); // Convert the file to a data URL
    }
});


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
// =================================================================== crud section==============
$("#subBtn").on('click', function() {
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
    formData.append("field_code", cropField); // Corrected the name to field_code

    // Send AJAX POST request to the backend
    $.ajax({
        url: "http://localhost:5050/green/api/v1/crop", // Backend endpoint
        type: "POST",
        processData: false,
        contentType: false,
        data: formData, // Form data with fields and file
        success: (response) => {
            console.log("Crop added successfully:", response);
            alert("Crop added successfully!");
            clearFields();
            cropIdGenerate(); // Clear input fields after success
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
    $.ajax({
        url: "http://localhost:5050/green/api/v1/crop",
        type: "GET",
        dataType: "json",
        success: (response) => {
            console.log("Crops fetched successfully:", response);
            populateCropTable(response);
        },
        error: (xhr, status, error) => {
            console.error("Error fetching crops:", xhr.responseText || error);
            alert("Failed to load crops.");
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
    $.ajax({
        url: "http://localhost:5050/green/api/v1/crop", // API endpoint to fetch crops
        type: "GET",
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
    if (confirm("Are you sure you want to delete this crop?")) {
        $.ajax({
            url: `http://localhost:5050/green/api/v1/crop/${cropCode}`, // API endpoint to delete crop
            type: "DELETE",
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
    formData.append("field_code", field);

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
    $.ajax({
        url: `http://localhost:5050/green/api/v1/crop/${cropCode}`, // API endpoint for updating crop
        type: "PUT",
        processData: false,
        contentType: false,
        data: formData,
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




