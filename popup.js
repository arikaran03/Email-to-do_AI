// document.addEventListener("DOMContentLoaded", () => {
//     // Get input fields and button
//     const emailInput = document.getElementById("email");
//     const passwordInput = document.getElementById("password");
//     const apiKeyInput = document.getElementById("apiKey");
//     const saveButton = document.getElementById("saveBtn");
//     const statusText = document.getElementById("status");

//     // if (!emailInput || !passwordInput || !apiKeyInput || !saveButton) {
//     //     console.error("One or more elements not found in popup.html!");
//     //     return;
//     // }'

//     saveButton.addEventListener("click", function(){
//         const email = emailInput.value.trim();
//         const appPass = passwordInput.value.trim(); 
//         const apiKey = apiKeyInput.value.trim();
        
//         if(email && appPass && apiKey){
//             console.log("hello");
//             localStorage.setItem("user-email", email); 
//             localStorage.setItem("app-password", appPass); 
//             localStorage.setItem("Gemini-api-key", apiKey); 

//         }
//     }); 
// });

document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const apiKeyInput = document.getElementById("apiKey");
    const saveButton = document.getElementById("saveBtn");
    const statusText = document.getElementById("status");

    const SERVER_URL = "http://127.0.0.1:5000"; // Flask server

    // Load saved data from Flask when popup opens
    fetch(`${SERVER_URL}/get_credentials`)
        .then(response => response.json())
        .then(data => {
            emailInput.value = data["user-email"] || "";
            passwordInput.value = data["app-password"] || "";
            apiKeyInput.value = data["Gemini-api-key"] || "";
        })
        .catch(error => console.error("Error loading credentials:", error));

    // Save data to Flask server
    saveButton.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const apiKey = apiKeyInput.value.trim();

        if (!email || !password || !apiKey) {
            alert("Please fill in all fields.");
            return;
        }

        fetch(`${SERVER_URL}/update_credentials`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "user-email": email,
                "app-password": password,
                "Gemini-api-key": apiKey
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            statusText.textContent = "Credentials saved successfully!";
            statusText.style.color = "green";
        })
        .catch(error => console.error("Error saving credentials:", error));
    });
});
