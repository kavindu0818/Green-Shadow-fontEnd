// Get buttons by their IDs
const managerButton = document.getElementById("managerBtn");
const adminButton = document.getElementById("adminBtn");
const scientistButton = document.getElementById("scientistBtn");

// Add event listeners to buttons to navigate to different pages
managerButton.addEventListener("click", function() {
    window.location.href = "../ManagerLoginPage.html";  // Replace with the actual URL for the manager page
});

adminButton.addEventListener("click", function() {
    window.location.href = "../html/AdministartiveLogin.html";  // Replace with the actual URL for the administrative page
});

scientistButton.addEventListener("click", function() {
    window.location.href = "../html/ScientiestLogin.html";  // Replace with the actual URL for the scientist page
});
