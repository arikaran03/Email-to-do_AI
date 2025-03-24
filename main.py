import os
import imaplib
import email
from email.header import decode_header
from bs4 import BeautifulSoup
import google.generativeai as genai
from dotenv import load_dotenv
import json
from datetime import datetime
import email.utils

# Load configuration from update.json
with open("update.json", "r") as file:
    config = json.load(file)

EMAIL_HOST = "imap.gmail.com"
EMAIL_USER = config.get("user-email")
EMAIL_PASS = config.get("app-password")
GEMINI_API_KEY = config.get("Gemini-api-key")
TIMEOUT = 15
PROCESSED_EMAILS_FILE = "processed_emails.json"

# Initialize Gemini AI
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")

# Ensure processed_emails.json exists
if not os.path.exists(PROCESSED_EMAILS_FILE):
    with open(PROCESSED_EMAILS_FILE, "w") as f:
        json.dump([], f)

# Load processed email IDs
with open(PROCESSED_EMAILS_FILE, "r") as f:
    processed_emails = set(json.load(f))

def keyword_based_classification(subject, body):
    """Manually classify emails before AI processing based on keywords."""
    subject_lower = subject.lower()
    body_lower = body.lower()

    # List of keywords for appreciation/help emails
    ignore_keywords = [
        "thank you", "thanks for applying", "thanks for participating",
        "we appreciate", "your application has been received", 
        "appreciate your interest", "we value your participation",
        "how can we help", "support team", "need assistance"
    ]
    
    if any(keyword in subject_lower or keyword in body_lower for keyword in ignore_keywords):
        return "Ignore"

    category_keywords = {
        "Interview Updates": ["interview", "hiring process", "selected for", "next round", "recruitment"],
        "Application Deadlines": ["deadline", "application closing", "last date"],
        "Exam/Contest Alerts": ["contest", "competition", "hackathon", "codeforces", "leetcode", "codechef"],
        "Scholarship & Fellowship Opportunities": ["scholarship", "fellowship", "funding opportunity"],
        "Course & Learning Resources": ["course", "webinar", "lecture", "tutorial", "learning resource"],
        "University & Academic Notices": ["university notice", "academic calendar", "semester update"],
        "Networking & Events": ["tech talk", "workshop", "session", "conference", "networking", "speaker"],
        "Spam & Advertisements": ["buy now", "discount", "offer", "promotion", "subscribe", "free trial"]
    }

    for category, keywords in category_keywords.items():
        if any(keyword in subject_lower or keyword in body_lower for keyword in keywords):
            return category

    return None  # If no match, let AI classify

def classify_email(subject, body):
    """Classify emails using manual keywords first, then AI fallback."""
    category = keyword_based_classification(subject, body)
    if category == "Ignore":
        return category  
    if category:
        return category  

    prompt = f"""
    You are an AI assistant that classifies emails for a student. Categorize the following email into one of these categories:
    - Interview Updates
    - Application Deadlines
    - Exam/Contest Alerts
    - Scholarship & Fellowship Opportunities
    - Course & Learning Resources
    - University & Academic Notices
    - Networking & Events
    - Spam & Advertisements
    - Other

    Email Details:
    Subject: {subject}
    Body: {body}

    Output the most suitable category as a single label from the list above.
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error classifying email: {e}")
        return "Other"

def summarize_email_content(subject, body):
    """Summarize email content into one sentence."""
    prompt = f"""
    Summarize the following email in **one sentence**, ensuring key details like dates, times, and relevant context are retained.

    Subject: {subject}
    Body: {body}

    Output only the single-sentence summary.
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error summarizing email: {e}")
        return "Summary unavailable."

def extract_email_body(msg):
    """Extract email body content from plain text or HTML."""
    body = ""
    
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))

            if "attachment" in content_disposition:
                continue

            try:
                payload = part.get_payload(decode=True)
                if payload:
                    payload = payload.decode('utf-8', errors='ignore')
            except Exception:
                continue

            if content_type == "text/plain":
                body += payload + "\n"
            elif content_type == "text/html":
                soup = BeautifulSoup(payload, "html.parser")
                body += soup.get_text(separator=" ", strip=True) + "\n"
    else:
        content_type = msg.get_content_type()
        try:
            payload = msg.get_payload(decode=True)
            if payload:
                payload = payload.decode('utf-8', errors='ignore')
        except Exception:
            payload = ""

        if content_type == "text/html":
            soup = BeautifulSoup(payload, "html.parser")
            body = soup.get_text(separator=" ", strip=True)
        else:
            body = payload

    return body.strip() or "(No Content)"

def fetch_and_classify_emails():
    """Fetch unread emails, classify, and summarize them."""
    global processed_emails
    mail = None
    try:
        mail = imaplib.IMAP4_SSL(EMAIL_HOST, timeout=TIMEOUT)
        mail.login(EMAIL_USER, EMAIL_PASS)
        mail.select("inbox", readonly=True)
        
        status, messages = mail.search(None, 'UNSEEN')
        if status != "OK" or not messages[0]:
            print("No unread emails found.")
            return []

        email_ids = messages[0].split()[:15]  
        results = []

        for e_id in email_ids:
            email_id = e_id.decode()

            if email_id in processed_emails:
                continue  # Skip already processed emails

            try:
                _, msg_data = mail.fetch(e_id, "(RFC822)")
                msg = email.message_from_bytes(msg_data[0][1])
                
                subject = decode_header(msg.get("Subject", ""))[0][0]
                if isinstance(subject, bytes):
                    subject = subject.decode(errors='ignore')

                body = extract_email_body(msg)
                category = classify_email(subject, body)
                
                if category == "Ignore":
                    continue

                summary = summarize_email_content(subject, body)

                results.append({
                    "id": email_id,
                    "subject": subject,
                    "category": category,
                    "summary": summary
                })

                processed_emails.add(email_id)  

            except Exception as e:
                print(f"Error processing email ID {email_id}: {e}")
                continue

        with open(PROCESSED_EMAILS_FILE, "w") as f:
            json.dump(list(processed_emails), f)

        return results
    except Exception as e:
        print(f"Connection error: {e}")
        return []
    finally:
        if mail:
            try:
                mail.close()
                mail.logout()
            except:
                pass

if __name__ == "__main__":
    emails = fetch_and_classify_emails()
    with open("emails.json", "w") as json_file:
        json.dump(emails, json_file, indent=4)
