const text = "Welcome to Manager"; // The text to animate
const h1Element = document.getElementById("animatedText");
let index = 0;

function typeWriter() {
    if (index < text.length) {
        h1Element.innerHTML += text[index];
        index++;
        setTimeout(typeWriter, 100); // Adjust the typing speed here
    }
}

// Start the animation
typeWriter();

document.getElementById('sing_upSet').addEventListener('click',function (){
    document.getElementById('viewModal').style.display='block';
    document.getElementById('log').style.display='none';


});

function closeModal() {
    document.getElementById("viewModal").style.display = "none";
    document.getElementById("log").style.display = "block";
}
$("#loginManager").on("click", function () {
    const myEmail = $("#emailInput").val(); // Get the email on click
    const checkPassword = $("#passwordInput").val(); // Get password on click

    if (!myEmail || !checkPassword) {
        alert("Please enter both email and password.");
        return;
    }

    sendEmail(myEmail, checkPassword);
});


function sendEmail(email, password) {

    const data = {
        email: email,
        password: password,
    };

    $.ajax({
        url: "http://localhost:8080/api/v1/auth/signin",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
    })
        .done((response) => {
            console.log("User logged in successfully:", response);
            if (response != null) {
                localStorage.setItem('token', response.token);
                window.location.href = "../ManagerDashboard.html";
            } else {
                alert("Invalid email or password. Please try again.");
            }
        })
        .fail((error) => {
            console.error("Error logging in:", error);
            alert(
                error.responseJSON?.message || "Failed to log in. Please try again."
            );
        });
}


$("#singUp_btn").on('click', function () {
    // Get values from input fields
    var email = $("#email_signUp").val();
    var password = $("#password_signUp").val();
    var role = $("#roleSelect_signUp").val();



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
        url: "http://localhost:8080/api/v1/auth/signup", // Backend endpoint
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: (response) => {
            console.log("Manager added successfully:", response);
            alert("Manager added successfully!");
            clearTextField(); // Clear input fields
            fieldIdGenerate(); // Refresh field IDs
        },
        error: (error) => {
            console.error("Error adding User:", error);
            alert("Failed to add manager. Please try again.");
        }
    });
});

function clearTextField(){
    $("#email").val("");
    $("#password").val("");
    $("#roleSelect").val("");
}
