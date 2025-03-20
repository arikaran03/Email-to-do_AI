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
    if (document.getElementById("floating-page")) return;

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
    floatingPage.style.width = "600px";  // Increased width
    floatingPage.style.height = "500px"; // Increased height
    floatingPage.style.backgroundColor = "#fff";
    floatingPage.style.boxShadow = "0px 0px 15px rgba(0, 0, 0, 0.3)";
    floatingPage.style.borderRadius = "12px";
    floatingPage.style.zIndex = "9999";
    floatingPage.style.padding = "20px";
    floatingPage.style.overflowY = "auto";
    floatingPage.style.display = "flex";
    floatingPage.style.flexDirection = "column";
    floatingPage.style.justifyContent = "flex-start"; 
    floatingPage.style.alignItems = "center";
    floatingPage.style.textAlign = "center";

    // Checklist container
    const checklistContainer = document.createElement("div");
    checklistContainer.id = "emailChecklist";
    checklistContainer.style.width = "100%";
    checklistContainer.style.textAlign = "left";
    checklistContainer.innerHTML = "<p>Loading emails...</p>";

    floatingPage.appendChild(checklistContainer);
    document.body.appendChild(overlay);
    document.body.appendChild(floatingPage);

    // Clicking outside the floating window closes it
    overlay.addEventListener("click", function () {
        document.body.removeChild(floatingPage);
        document.body.removeChild(overlay);
    });

    loadEmails();
}


function loadEmails() {
    const checklistContainer = document.getElementById("emailChecklist");
    checklistContainer.innerHTML = ""; // Clear previous content

    // Create separate sections
    const progressSection = document.createElement("div");
    progressSection.id = "progressSection";
    progressSection.innerHTML = "<h3>📌 In Progress</h3>";

    const completedSection = document.createElement("div");
    completedSection.id = "completedSection";
    completedSection.innerHTML = "<h3>✅ Completed</h3>";

    const jsonURL = chrome.runtime.getURL("emails.json");

    fetch(jsonURL)
        .then(response => response.json())
        .then(emails => {
            chrome.storage.local.get("checkedEmails", function (data) {
                const checkedEmails = data.checkedEmails || {};

                emails.forEach(email => {
                    const category = email.category?.trim().toLowerCase();
                    if (category === "other" || category === "spam") return;

                    const emailItem = document.createElement("div");
                    emailItem.className = "email-item";

                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = `email-${email.id}`;
                    checkbox.checked = !!checkedEmails[email.id];

                    const label = document.createElement("label");
                    label.htmlFor = checkbox.id;
                    label.innerHTML = email.subject;

                    checkbox.addEventListener("change", function () {
                        checkedEmails[email.id] = checkbox.checked;
                        chrome.storage.local.set({ checkedEmails });

                        updateSections(emailItem, checkbox.checked, progressSection, completedSection);
                    });

                    emailItem.appendChild(checkbox);
                    emailItem.appendChild(label);
                    
                    // Place in the correct section
                    updateSections(emailItem, checkbox.checked, progressSection, completedSection);
                });

                checklistContainer.appendChild(progressSection);
                checklistContainer.appendChild(completedSection);
            });
        })
        .catch(error => {
            console.error("Error loading emails:", error);
            checklistContainer.innerHTML = "<p>Failed to load emails.</p>";
        });
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