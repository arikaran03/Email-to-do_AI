document.addEventListener("DOMContentLoaded", function () {
    const checklistContainer = document.getElementById("emailChecklist");
  
    fetch("emails.json")
      .then(response => response.json())
      .then(emails => {
        checklistContainer.innerHTML = ""; // Clear loading message
        let hasPriorityEmail = false;
  
        emails.forEach(email => {
          const category = email.category?.trim().toLowerCase();
  
          // Ignore emails categorized as "Other" or "Spam"
          if (category === "other" || category === "spam") return;
  
          hasPriorityEmail = true;
          const emailItem = document.createElement("div");
          emailItem.className = "email-item";
  
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = `email-${email.id}`;
  
          const label = document.createElement("label");
          label.htmlFor = checkbox.id;
          label.textContent = email.subject;
  
          emailItem.append(checkbox, label);
          checklistContainer.appendChild(emailItem);
        });
  
        if (!hasPriorityEmail) {
          checklistContainer.innerHTML = "<p>No priority emails found.</p>";
        }
      })
      .catch(error => {
        console.error("Error loading emails:", error);
        checklistContainer.innerHTML = "<p>Failed to load emails.</p>";
      });
  });
  

