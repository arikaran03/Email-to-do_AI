document.addEventListener("DOMContentLoaded", () => {
    // Get input fields and button
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const apiKeyInput = document.getElementById("apiKey");
    const saveButton = document.getElementById("saveBtn");
    const statusText = document.getElementById("status");

    // if (!emailInput || !passwordInput || !apiKeyInput || !saveButton) {
    //     console.error("One or more elements not found in popup.html!");
    //     return;
    // }'

    saveButton.addEventListener("click", function(){
        const email = emailInput.value.trim();
        const appPass = passwordInput.value.trim(); 
        const apiKey = apiKeyInput.value.trim();
        
        if(email && appPass && apiKey){
            console.log("hello");
            localStorage.setItem("user-email", email); 
            localStorage.setItem("app-password", appPass); 
            localStorage.setItem("Gemini-api-key", apiKey); 
            
        }
    }); 

    
});
