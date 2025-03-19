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

    // Attach click event to open floating modal
    aiHelpButton.addEventListener("click", function () {
        console.log("Clicked");
        showFloatingPage();
    });
}

// Function to create and show the floating page
function showFloatingPage() {
    if (document.getElementById("floating-page")) return; // Avoid duplicates

    // Create overlay background
    const overlay = document.createElement("div");
    overlay.id = "floating-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "9998";

    // Create floating page (modal)
    const floatingPage = document.createElement("div");
    floatingPage.id = "floating-page";
    floatingPage.style.position = "fixed";
    floatingPage.style.top = "50%";
    floatingPage.style.left = "50%";
    floatingPage.style.transform = "translate(-50%, -50%)";
    floatingPage.style.width = "400px";
    floatingPage.style.height = "300px";
    floatingPage.style.backgroundColor = "#fff";
    floatingPage.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)";
    floatingPage.style.borderRadius = "10px";
    floatingPage.style.zIndex = "9999";
    floatingPage.style.padding = "20px";
    floatingPage.style.display = "flex";
    floatingPage.style.flexDirection = "column";
    floatingPage.style.justifyContent = "center";
    floatingPage.style.alignItems = "center";
    floatingPage.style.textAlign = "center";

    // Close button
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.marginTop = "20px";
    closeButton.style.padding = "10px 20px";
    closeButton.style.backgroundColor = "#ff4d4d";
    closeButton.style.color = "#fff";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";

    closeButton.addEventListener("click", function () {
        document.body.removeChild(floatingPage);
        document.body.removeChild(overlay);
    });

    // Content inside the floating page
    const content = document.createElement("p");
    content.innerText = "This is your floating page content!";

    floatingPage.appendChild(content);
    floatingPage.appendChild(closeButton);

    // Append elements to the body
    document.body.appendChild(overlay);
    document.body.appendChild(floatingPage);
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
// Start observing for Gmail load
waitForGmail();

