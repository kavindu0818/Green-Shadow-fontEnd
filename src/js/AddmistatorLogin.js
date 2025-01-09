const person = ""
$("#addmistor-log").on("click", function () {
    const myEmail = $("#emailInput").val(); // Get the email on click
    const checkPassword = $("#password").val(); // Get password on click

    if (!myEmail || !checkPassword) {
        alert("Please enter both email and password.");
        return;
    }

       let per = getAddministor(myEmail);

    // if (per == "ADMINISTRATIVE"){
    //     sendEmail(myEmail, checkPassword);
    // }

    sendEmail(myEmail, checkPassword);
    console.log("MAMA Administer")

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

            return user.role;


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