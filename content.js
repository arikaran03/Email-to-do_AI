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

    const overlay = document.createElement("div");
    overlay.id = "floating-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "9998";

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
    floatingPage.style.overflowY = "auto";
    floatingPage.style.display = "flex";
    floatingPage.style.flexDirection = "column";
    floatingPage.style.justifyContent = "center";
    floatingPage.style.alignItems = "center";
    floatingPage.style.textAlign = "center";

    const checklistContainer = document.createElement("div");
    checklistContainer.id = "emailChecklist";
    checklistContainer.style.width = "100%";
    checklistContainer.style.textAlign = "left";
    checklistContainer.innerHTML = "<p>Loading emails...</p>";

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.marginTop = "10px";
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

    floatingPage.appendChild(checklistContainer);
    floatingPage.appendChild(closeButton);
    document.body.appendChild(overlay);
    document.body.appendChild(floatingPage);

    loadEmails();
}

function loadEmails() {
    const checklistContainer = document.getElementById("emailChecklist");
    const jsonURL = chrome.runtime.getURL("emails.json");

    fetch(jsonURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(emails => {
            checklistContainer.innerHTML = "";
            let hasPriorityEmail = false;

            chrome.storage.local.get("checkedEmails", function (data) {
                const checkedEmails = data.checkedEmails || {};

                emails.forEach(email => {
                    const category = email.category?.trim().toLowerCase();
                    if (category === "other" || category === "spam") return;

                    hasPriorityEmail = true;
                    const emailItem = document.createElement("div");
                    emailItem.className = "email-item";

                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = `email-${email.id}`;
                    checkbox.checked = !!checkedEmails[email.id];

                    const label = document.createElement("label");
                    label.htmlFor = checkbox.id;
                    label.textContent = email.subject;

                    if (checkbox.checked) {
                        label.style.textDecoration = "line-through";
                        label.style.color = "gray";
                    }

                    checkbox.addEventListener("change", function () {
                        checkedEmails[email.id] = checkbox.checked;
                        chrome.storage.local.set({ checkedEmails });

                        if (checkbox.checked) {
                            label.style.textDecoration = "line-through";
                            label.style.color = "gray";
                        } else {
                            label.style.textDecoration = "none";
                            label.style.color = "black";
                        }
                    });

                    emailItem.appendChild(checkbox);
                    emailItem.appendChild(label);
                    checklistContainer.appendChild(emailItem);
                });

                if (!hasPriorityEmail) {
                    checklistContainer.innerHTML = "<p>No priority emails found.</p>";
                }
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

waitForGmail();
