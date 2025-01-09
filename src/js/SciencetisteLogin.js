const person = ""
$("#sciLogin").on("click", function () {
    const myEmail = $("#emailInput").val(); // Get the email on click
    const checkPassword = $("#password").val(); // Get password on click

    if (!myEmail || !checkPassword) {
        alert("Please enter both email and password.");
        return;
    }

    getAddministor(myEmail);

    console.log("MAMA Administer")
    sendEmail(myEmail, checkPassword);
});

function getAddministor(myEmail){

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
        alert("No token found");
        return;
    }


    $.ajax({
        url: `http://localhost:8080/api/v1/user/${myEmail}`, // API endpoint
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: (user) => {
            if (!user) {
                alert("Not Addministor!!");
                return;
            }

        },
        error: (xhr, status, error) => {
            console.error("Error fetching field deails:", error);
            alert("Failed to fetch field details. Please try again.");
        }
    });
}


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