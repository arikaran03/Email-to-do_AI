# 📧 Email-to-do_AI ✅  
This **Chrome extension** enhances **email productivity** by extracting key details from emails and automatically generating a **structured to-do list**. It helps users **stay organized** by identifying important tasks directly from their inbox.  

---

## 🚀 Steps to Run the Chrome Extension  

### 1️⃣ Set Up the Project in VS Code  
- Open **VS Code** and navigate to your extension’s project folder.  
- Ensure you have saved all the required files needed for the extension to function properly.  

---

### 2️⃣ Load the Extension in Chrome  
1. 🌐 Open **Google Chrome**  
2. 🔗 Open [Chrome Extensions Page](chrome://extensions/) in the address bar.  
3. ⚙️ Enable **Developer Mode** (toggle switch at the top right).  
4. 📂 Click **Load Unpacked**  
5. 🗂️ Select your project folder  
6. ✅ Your extension will be loaded, and you should see its **icon in the Chrome toolbar**.  

---

### 3️⃣ Set Up API Keys & App Passwords  
🔐 **Click the extension icon → Enter:**  
- ✉️ **Email Address**  
- 🔑 **Google App Password** (generated from [Google Account Security](https://myaccount.google.com/apppasswords))  

🛠 **How to create a Google App Password?**  
1. Navigate to your Google Account → **Manage your Google Account**.  
    ![Mange your google account](assets/google_account.JPG) 
2. 🔍 On the right side of the Account page, open **Security**.  
    ![Google Security page](assets/security.JPG)    
3. ✅ In the **Security** page, if **Two-Step Verification** is not enabled, **turn it on**.  
    ![Verification](assets/verify.JPG)  
4. 🔎 Search for **App Passwords** and open it.  
    ![Search App Passwords](assets/search.JPG) 
5. 🏷️ In **App Passwords**, create an app name (e.g., `Mail_To_Do`).  
    ![App Name](assets/app_name.JPG)   
6. 🆕 Once the app name is created, your **App Password** will be generated. Use this for authentication.  
    ![App Password](assets/app_pass.JPG)  

- 🤖 **Gemini AI API Key**  
   - Get your **Gemini AI API Key** from [Google AI Studio](https://aistudio.google.com/).  
   - Use this **API Key** for authentication.  
      ![API Key](assets/api_key.JPG) 

📌 These details are **stored securely in local storage** and used for extracting email details.  

---

### 4️⃣ Testing the Extension in Gmail  
- 📧 Open **[Gmail](https://mail.google.com/)**  
- ✅ Look for the **checklist icon** on the Gmail page.  
- 📝 Click the icon → The extension will scan emails and display a **To-Do List** categorized into:  
  - [ ] **In Progress** (Pending Tasks) – Tasks that need to be completed.  
  - [x] **Completed** (Finished Tasks) – Once a task is done, you can mark it as completed by checking the box.  

---

### 5️⃣ Debugging Issues (If Needed)  
- 🛠️ Open Chrome DevTools (`Ctrl + Shift + I` / `Cmd + Option + I`)  
- 📜 Go to the **Console** tab → Check for errors in `background.js`, `content.js`, or `popup.js`.  
- 🔄 If the extension doesn’t load, go to `chrome://extensions/`, click **Reload**.  

---

## 🔍 How the Chrome Extension Works?  
✅ A **checklist icon** appears in Gmail after installing the extension.  
✅ Clicking the icon asks for:  
  - 📩 **Email**  
  - 🔑 **App Password**  
  - 🔐 **API Key**  
*(Stored securely in local storage)*  

---

## 📋 To-Do List Structure  
### 📝 Tasks  
Tasks are displayed in two sections:  
1. **In Progress** – 🚧 Pending tasks  
2. **Completed** – ✅ Finished tasks  

---

### 📤 Extracted Email Details  
The tasks are **extracted from emails**, including:  
📌 **Subject**: Email subject line  
📌 **Sender**: Name or email address  
📌 **Date**: When received  
📌 **Summary**: Brief key details  
📌 **Due Date**: Any mentioned deadline  

---
