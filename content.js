const aiHelpImgURL = chrome.runtime.getURL("assets/checklist.png"); // Updated icon

function addAIHelpButtonToGmail() {
    const composeButton = document.querySelector("div[gh='cm']");

    if (!composeButton) {
        console.warn("Gmail Compose button not found. Retrying...");
        return; // Stop here and let MutationObserver handle it
    }

    if (document.getElementById("ai-help-button")) return;

    // Create AI Help Button
    const aiHelpButton = document.createElement("img");
    aiHelpButton.id = "ai-help-button";
    aiHelpButton.src = aiHelpImgURL; // Use the new icon
    aiHelpButton.style.height = "40px";
    aiHelpButton.style.width = "40px";
    aiHelpButton.style.cursor = "pointer";
    aiHelpButton.style.marginLeft = "10px";

    // Insert the button next to the Compose button
    composeButton.parentNode.insertBefore(aiHelpButton, composeButton.nextSibling);

    console.log("✅ AI Help Button added successfully in Gmail.");
}

// Use MutationObserver to detect when Gmail loads
function waitForGmail() {
    const observer = new MutationObserver((mutations, obs) => {
        const composeButton = document.querySelector("div[gh='cm']");
        if (composeButton) {
            console.log("✅ Gmail loaded, adding AI Help Button...");
            addAIHelpButtonToGmail();
            obs.disconnect(); // Stop observing after adding the button
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Run when the page loads
window.addEventListener("load", waitForGmail);