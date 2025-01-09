document.getElementById('addBtn').addEventListener('click',function (){
    document.getElementById('addUserDiv').style.display='block';
    document.getElementById('viewDetails').style.display='none';

});

function closeModal() {
    document.getElementById("updateUserDiv").style.display = "none";
}

$("#usAdd").on('click', function () {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }
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
        url: "http://localhost:8080/api/v1/user", // Backend endpoint
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        headers: {
            "Authorization": "Bearer " + token
        },
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

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/user",
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
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
                        <i class="fas fa-edit" title="Update" onclick="openUpdateUserModal('${user.email}')"></i>
                     
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

function openUpdateUserModal(userCode) {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }

    document.getElementById("updateUserDiv").style.display = "block";



    $.ajax({
        url: `http://localhost:8080/api/v1/user/${userCode}`, // API endpoint
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (user) => {
            if (!user) {
                alert("No data found for the selected user.");
                return;
            }

            $("#upemail").val(user.email);
            $("#upPassword").val(user.password);
            $("#upFlocation").val(field.fieldLocation || "N/A");

        },
        error: (xhr, status, error) => {
            console.error("Error fetching field deails:", error);
            alert("Failed to fetch field details. Please try again.");
        }
    });
}
document.getElementById("usUpdate").addEventListener("click", function () {

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }


    const email = $("#upemail").val();
    const pass =$("#upPassword").val();
    const rol =$("#upRoleSelect").val();


    if (!email || !pass || !rol) {
        alert("All User are required!");
        return;
    }

    const formData = {
        email: email,
        password: pass,
        roel: rol,
    };


    console.log("Form data:", formData);

    $.ajax({
        url: `http://localhost:8080/api/v1/user/${formData.email}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(formData),
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function () {
            alert("User details updated successfully!");
            loadTable();
            document.getElementById("updateUserDiv").style.display = "none";
        },
        error: function (xhr) {
            console.error("Error:", xhr.responseText || xhr.statusText);
            alert(`Failed to update user details. Error: ${xhr.responseText || xhr.statusText}`);
        },
    });
});

$(document).ready(function () {

    $("#userbar").on("keyup", function () {
        const searchValue = $(this).val().toLowerCase();

        // Loop through the table rows
        $("#userTable tbody tr").filter(function () {

            $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -0);
        });
    });
});
