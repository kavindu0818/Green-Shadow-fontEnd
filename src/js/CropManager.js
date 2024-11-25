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

            // Display the image
            $("#imageUpdateView").html(
                `<img src="data:image/png;base64,${crop.image}" alt="Crop Image" style="width: 200px; height: 80px;">`
            );
        },
        error: (xhr, status, error) => {
            console.error("Error fetching crop details:", error);
            alert("Failed to fetch crop details. Please try again.");
        }
    });

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
    formData.append("field_code", cropField);


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
            clearFields(); // Clear input fields after success
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



