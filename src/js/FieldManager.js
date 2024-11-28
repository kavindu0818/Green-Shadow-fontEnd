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

// Function placeholders for Edit and Delete actions
function editField(fieldId) {
    alert(`Edit functionality for Field ID: ${fieldId}`);
}

function deleteField(fieldId) {
    alert(`Delete functionality for Field ID: ${fieldId}`);
}



function populateCropTable(crops) {

    console.log(crops)
    try {
        const tableBody = $("#fieldTable tbody");
        tableBody.empty(); // Clear existing rows

        crops.forEach((crop) => {
            const row = `
                <tr>
                    <td>${crop.fieldCode}</td>
                    <td>${crop.fieldName}</td>
                    <td><img src="data:image/png;base64,${crop.image}" alt="Crop Image" style="width: 50px; height: 50px;"></td>
                    <td>${crop.fieldLocation}</td>
                    <td class="action-icons">
                        <i class="fas fa-edit" title="Update" onclick="openUpdateModal('${crop.fieldCode}')"></i>
                        <i class="fas fa-eye" title="View" onclick="openViewModal('${crop.fieldCode}')"></i>
                        // <i class="fas fa-trash-alt" title="Delete" onclick="deleteCrop('${crop.fieldCode}')"></i>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    } catch (e) {
        console.error("Error populating table:", e);
    }
}

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
