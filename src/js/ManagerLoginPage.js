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
    $.ajax({
        url: `http://localhost:5050/green/api/v1/user/${email}`, // API endpoint
        type: "GET",
        contentType: "application/json",
        success: (us) => {
            if (!us) {
                alert("No user found with the provided email.");
                return;
            }

            const truePassword = us.password;
            const trueRole = us.role;
            const defaultRole = "MANAGER";

            // Validate password and role
            if (truePassword === password && trueRole === defaultRole) {
                alert("Login successful! Redirecting...");
                window.location.href = "../Dashboard/ManagerDashboard.html";
            } else {
                alert("Invalid password or role.");
            }
        },
        error: (xhr, status, error) => {
            console.error("Error fetching user details:", xhr.responseText, status, error);
            alert("Failed to fetch user details: " + (xhr.responseText || error));
        },
    });
}
