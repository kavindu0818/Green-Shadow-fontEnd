document.getElementById('addBtn').addEventListener('click',function (){
    document.getElementById('addUserDiv').style.display='block';
    document.getElementById('viewDetails').style.display='none';

});

$("#usAdd").on('click', function () {
    // Get values from input fields
    var email = $("#email").val();
    var password = $("#password").val();
    var role = $("#roleSelect").val();



    // Validate inputs
    if (!email || !password || !role) {
        alert("All User are required.");
        return;
    }
    // Create FormData
    var formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);


    // AJAX POST request
    $.ajax({
        url: "http://localhost:5050/green/api/v1/user", // Backend endpoint
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: (response) => {
            console.log("User added successfully:", response);
            alert("User added successfully!");
            clearTextField(); // Clear input fields
            fieldIdGenerate(); // Refresh field IDs
        },
        error: (error) => {
            console.error("Error adding User:", error);
            alert("Failed to add user. Please try again.");
        }
    });
});

function clearTextField(){
    $("#email").val("");
    $("#password").val("");
    $("#roleSelect").val("");
}

loadTable();
function loadTable() {
    // $('#fieldTable tbody').empty(); // Clear the table body before appending new rows

    $.ajax({
        url: "http://localhost:5050/green/api/v1/user",
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
function populateEqaTable(user) {

    console.log(user)
    try {
        const tableBody = $("#userTable tbody");
        tableBody.empty(); // Clear existing rows

        user.forEach((user) => {
            const row = `
                <tr>
                    <td>${user.email}</td>
                    <td>${user.password}</td>
                    <td>${user.role}</td>
                    <td class="action-icons">
                        <i class="fas fa-edit" title="Update" onclick="openUpdateEqeModal('${user.email}')"></i>
                        <i class="fas fa-eye" title="View" onclick="viewEquDetails('${user.email}')"></i>
                        <i class="fas fa-trash-alt" title="Delete" onclick="deleteField('${user.email}')"></i>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    } catch (e) {
        console.error("Error populating table:", e);
    }
}
