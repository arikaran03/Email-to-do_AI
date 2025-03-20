const aiHelpImgURL = chrome.runtime.getURL("assets/checklist.png"); // Updated icon

function addAIHelpButtonToGmail() {
    const composeButton = document.querySelector("div[gh='cm']");

    if (!composeButton) {
        console.warn("Gmail Compose button not found. Retrying...");
        return;
    }

    if (document.getElementById("ai-help-button")) return;

    const aiHelpButton = document.createElement("img");
    aiHelpButton.id = "ai-help-button";
    aiHelpButton.src = aiHelpImgURL;
    aiHelpButton.style.height = "40px";
    aiHelpButton.style.width = "40px";
    aiHelpButton.style.cursor = "pointer";
    aiHelpButton.style.marginLeft = "10px";

    composeButton.parentNode.insertBefore(aiHelpButton, composeButton.nextSibling);
    console.log("✅ AI Help Button added successfully in Gmail.");

    aiHelpButton.addEventListener("click", function () {
        showFloatingPage();
    });
}

function showFloatingPage() {
    if (document.getElementById("floating-page")) {
        loadEmails();  // Refresh emails every time the window opens
        return;
    }

    // Create overlay (click outside to close)
    const overlay = document.createElement("div");
    overlay.id = "floating-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "9998";

    // Create floating window
    const floatingPage = document.createElement("div");
    floatingPage.id = "floating-page";
    floatingPage.style.position = "fixed";
    floatingPage.style.top = "50%";
    floatingPage.style.left = "50%";
    floatingPage.style.transform = "translate(-50%, -50%)";
    floatingPage.style.width = "600px";
    floatingPage.style.height = "500px";
    floatingPage.style.backgroundColor = "#fff";
    floatingPage.style.boxShadow = "0px 0px 15px rgba(0, 0, 0, 0.3)";
    floatingPage.style.borderRadius = "12px";
    floatingPage.style.zIndex = "9999";
    floatingPage.style.padding = "20px";
    floatingPage.style.overflowY = "auto";
    floatingPage.style.display = "flex";
    floatingPage.style.flexDirection = "column";
    floatingPage.style.alignItems = "center";
    floatingPage.style.textAlign = "center";

    // Add heading image at the top center
    const headingImage = document.createElement("img");
    headingImage.src = chrome.runtime.getURL("assets/logo.png");
    headingImage.style.width = "200px";
    headingImage.style.marginBottom = "10px";

    // Checklist container
    const checklistContainer = document.createElement("div");
    checklistContainer.id = "emailChecklist";
    checklistContainer.style.width = "100%";
    checklistContainer.style.textAlign = "left";
    checklistContainer.innerHTML = "<p>Loading emails...</p>";

    floatingPage.appendChild(headingImage);
    floatingPage.appendChild(checklistContainer);
    document.body.appendChild(overlay);
    document.body.appendChild(floatingPage);

    // Clicking outside closes the floating window
    overlay.addEventListener("click", function () {
        document.body.removeChild(floatingPage);
        document.body.removeChild(overlay);
    });

    // Reload emails whenever the floating window opens
    loadEmails();
}




function loadEmails() {
    const checklistContainer = document.getElementById("emailChecklist");
    
    // Ensure the checklist is empty before reloading
    checklistContainer.innerHTML = `
        <h3>📌 In Progress</h3>
        <div id="progressSection" style="background-color: #fff9c4; padding: 10px; border-radius: 8px;"></div>
        <hr>
        <h3>✅ Completed</h3>
        <div id="completedSection" style="background-color: #c8e6c9; padding: 10px; border-radius: 8px;"></div>
    `;

    const progressSection = document.getElementById("progressSection");
    const completedSection = document.getElementById("completedSection");

    const jsonURL = chrome.runtime.getURL("emails.json");

    fetch(jsonURL)
        .then(response => response.json())
        .then(emails => {
            chrome.storage.local.get("checkedEmails", function (data) {
                const checkedEmails = data.checkedEmails || {};

                emails.forEach(email => {
                    const emailItem = document.createElement("div");
                    emailItem.className = "email-item";
                    emailItem.style.transition = "opacity 0.5s, transform 0.5s";

                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = `email-${email.id}`;
                    checkbox.checked = !!checkedEmails[email.id];

                    const label = document.createElement("label");
                    label.htmlFor = checkbox.id;
                    label.textContent = email.subject;

                    checkbox.addEventListener("change", function () {
                        checkedEmails[email.id] = checkbox.checked;
                        chrome.storage.local.set({ checkedEmails });

                        if (checkbox.checked) {
                            animateMoveToCompleted(emailItem, label);
                        } else {
                            animateMoveToProgress(emailItem, label);
                        }
                    });

                    // checkbox.style.borderRadius= 100%;
                    emailItem.appendChild(checkbox);
                    emailItem.appendChild(label);

                    if (checkbox.checked) {
                        completedSection.appendChild(emailItem);
                    } else {
                        progressSection.appendChild(emailItem);
                    }
                });
            });
        })
        
        .catch(error => {
            console.error("Error loading emails:", error);
            checklistContainer.innerHTML = "<p>Failed to load emails.</p>";
        });
}




// 🎬 Animation to move an item to "Completed" section
function animateMoveToCompleted(item, label) {
    label.style.textDecoration = "line-through";
    label.style.color = "gray";
    item.style.opacity = "0";
    item.style.transform = "translateX(50px)";

    setTimeout(() => {
        document.getElementById("completedSection").appendChild(item);
        item.style.opacity = "1";
        item.style.transform = "translateX(0)";
    }, 500);
}

// 🎬 Animation to move an item back to "Progress" section
function animateMoveToProgress(item, label) {
    label.style.textDecoration = "none";
    label.style.color = "black";
    item.style.opacity = "0";
    item.style.transform = "translateX(-50px)";

    setTimeout(() => {
        document.getElementById("progressSection").appendChild(item);
        item.style.opacity = "1";
        item.style.transform = "translateX(0)";
    }, 500);
}

function waitForGmail() {
    const observer = new MutationObserver((mutations, obs) => {
        const composeButton = document.querySelector("div[gh='cm']");
        if (composeButton) {
            console.log("✅ Gmail loaded, adding AI Help Button...");
            addAIHelpButtonToGmail();
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function updateSections(emailItem, isChecked, progressSection, completedSection) {
    if (isChecked) {
        emailItem.style.textDecoration = "line-through";
        emailItem.style.color = "gray";
        completedSection.appendChild(emailItem);
    } else {
        emailItem.style.textDecoration = "none";
        emailItem.style.color = "black";
        progressSection.appendChild(emailItem);
    }
}

waitForGmail();


