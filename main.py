# import imaplib
# import email
# from email.header import decode_header
# from bs4 import BeautifulSoup

# # Configuration
# EMAIL_HOST = "imap.gmail.com"
# EMAIL_USER = "azhackathon@gmail.com"
# EMAIL_PASS = "wsvq uwvy ootb tfgk"
# TIMEOUT = 15  # Seconds for connection timeout

# def fetch_unread_emails():
#     mail = None
#     try:
#         # Initialize connection with timeout
#         mail = imaplib.IMAP4_SSL(EMAIL_HOST, timeout=TIMEOUT)
#         mail.login(EMAIL_USER, EMAIL_PASS)
#         mail.select("inbox", readonly=True)

#         # Fetch unread emails
#         status, messages = mail.search(None, 'UNSEEN')
#         if status != "OK" or not messages[0]:
#             return []

#         email_ids = messages[0].split()[:15]  # Process up to 15 emails
#         results = []

#         for e_id in email_ids:
#             try:
#                 _, msg_data = mail.fetch(e_id, "(RFC822)")
#                 msg = email.message_from_bytes(msg_data[0][1])
                
#                 # Decode subject
#                 subject_header = decode_header(msg.get("Subject", ""))
#                 subject = "(No Subject)"
#                 if subject_header and subject_header[0]:
#                     subject_bytes, encoding = subject_header[0]
#                     encoding = encoding or 'utf-8'
#                     subject = subject_bytes.decode(encoding, errors='ignore') if isinstance(subject_bytes, bytes) else str(subject_bytes)
                
#                 # Extract body content
#                 body = ""
#                 if msg.is_multipart():
#                     for part in msg.walk():
#                         content_type = part.get_content_type()
#                         content_disposition = str(part.get("Content-Disposition"))
#                         if "attachment" in content_disposition:
#                             continue
#                         try:
#                             part_payload = part.get_payload(decode=True)
#                             if part_payload:
#                                 part_payload = part_payload.decode('utf-8', errors='ignore')
#                         except Exception:
#                             continue
#                         if content_type == "text/plain":
#                             body += part_payload + "\n"
#                         elif content_type == "text/html":
#                             # Use BeautifulSoup to strip HTML tags and extract text
#                             soup = BeautifulSoup(part_payload, "html.parser")
#                             text = soup.get_text(separator=" ", strip=True)
#                             body += text + "\n"
#                 else:
#                     content_type = msg.get_content_type()
#                     try:
#                         payload = msg.get_payload(decode=True)
#                         if payload:
#                             payload = payload.decode('utf-8', errors='ignore')
#                     except Exception:
#                         payload = ""
#                     if content_type == "text/html":
#                         soup = BeautifulSoup(payload, "html.parser")
#                         body = soup.get_text(separator=" ", strip=True)
#                     else:
#                         body = payload

#                 results.append({
#                     "id": e_id.decode(),
#                     "subject": subject,
#                     "body": body.strip()
#                 })
#             except Exception as e:
#                 print(f"Error processing email: {str(e)[:100]}")
#                 continue

#         return results
#     except Exception as e:
#         print(f"Connection error: {str(e)[:100]}")
#         return []
#     finally:
#         if mail:
#             try:
#                 mail.close()
#                 mail.logout()
#             except:
#                 pass

# if __name__ == "__main__":
#     emails = fetch_unread_emails()
#     for email_data in emails:
#         print(f"ID: {email_data['id']}")
#         print(f"Subject: {email_data['subject']}")
#         print(f"Body:\n{email_data['body']}\n")



# import os
# import imaplib
# import email
# from email.header import decode_header
# from bs4 import BeautifulSoup
# import google.generativeai as genai
# from dotenv import load_dotenv

# # Load environment variables from a .env file
# load_dotenv()

# # Configuration (Set these in your .env file)
# EMAIL_HOST = "imap.gmail.com"
# EMAIL_USER = os.getenv("EMAIL_USER")  # Set in .env
# EMAIL_PASS = os.getenv("EMAIL_PASS")  # Set in .env
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Set in .env
# TIMEOUT = 15  # Timeout for connection in seconds

# # Initialize Gemini API with the correct model
# genai.configure(api_key=GEMINI_API_KEY)
# model = genai.GenerativeModel("gemini-1.5-pro-latest")  # Corrected model name

# def classify_email(subject, body):
#     """Classify emails into predefined categories using Gemini AI."""
#     prompt = f"""
#     You are an AI assistant that classifies emails for a student. Categorize the following email into one of these categories:
#     - Interview Updates
#     - Application Deadlines
#     - Exam/Contest Alerts
#     - Scholarship & Fellowship Opportunities
#     - Course & Learning Resources
#     - University & Academic Notices
#     - Networking & Events
#     - Spam & Advertisements
#     - Other

#     Email Details:
#     Subject: {subject}
#     Body: {body}

#     Output the most suitable category as a single label from the list above.
#     """
#     try:
#         response = model.generate_content(prompt)
#         return response.text.strip()
#     except Exception as e:
#         print(f"Error classifying email: {e}")
#         return "Other"

# def fetch_and_classify_emails():
#     """Fetch unread emails from the inbox and classify them."""
#     mail = None
#     try:
#         mail = imaplib.IMAP4_SSL(EMAIL_HOST, timeout=TIMEOUT)
#         mail.login(EMAIL_USER, EMAIL_PASS)
#         mail.select("inbox", readonly=True)
        
#         status, messages = mail.search(None, 'UNSEEN')
#         if status != "OK" or not messages[0]:
#             print("No unread emails found.")
#             return []

#         email_ids = messages[0].split()[:15]  # Process up to 15 emails
#         results = []

#         for e_id in email_ids:
#             try:
#                 _, msg_data = mail.fetch(e_id, "(RFC822)")
#                 msg = email.message_from_bytes(msg_data[0][1])
                
#                 # Decode subject
#                 subject = "(No Subject)"
#                 subject_header = decode_header(msg.get("Subject", ""))
#                 if subject_header and subject_header[0]:
#                     subject_bytes, encoding = subject_header[0]
#                     encoding = encoding or 'utf-8'
#                     subject = subject_bytes.decode(encoding, errors='ignore') if isinstance(subject_bytes, bytes) else str(subject_bytes)

#                 # Extract email body
#                 body = ""
#                 if msg.is_multipart():
#                     for part in msg.walk():
#                         content_type = part.get_content_type()
#                         content_disposition = str(part.get("Content-Disposition"))
#                         if "attachment" in content_disposition:
#                             continue
#                         try:
#                             part_payload = part.get_payload(decode=True)
#                             if part_payload:
#                                 part_payload = part_payload.decode('utf-8', errors='ignore')
#                         except Exception:
#                             continue
#                         if content_type == "text/plain":
#                             body += part_payload + "\n"
#                         elif content_type == "text/html":
#                             soup = BeautifulSoup(part_payload, "html.parser")
#                             body += soup.get_text(separator=" ", strip=True) + "\n"
#                 else:
#                     content_type = msg.get_content_type()
#                     try:
#                         payload = msg.get_payload(decode=True)
#                         if payload:
#                             payload = payload.decode('utf-8', errors='ignore')
#                     except Exception:
#                         payload = ""
#                     if content_type == "text/html":
#                         soup = BeautifulSoup(payload, "html.parser")
#                         body = soup.get_text(separator=" ", strip=True)
#                     else:
#                         body = payload

#                 body = body.strip() or "(No Content)"  # Handle empty body
                
#                 # Classify email
#                 category = classify_email(subject, body)

#                 results.append({
#                     "id": e_id.decode(),
#                     "subject": subject,
#                     "category": category,
#                     "body": body
#                 })
#             except Exception as e:
#                 print(f"Error processing email ID {e_id.decode()}: {e}")
#                 continue

#         return results
#     except Exception as e:
#         print(f"Connection error: {e}")
#         return []
#     finally:
#         if mail:
#             try:
#                 mail.close()
#                 mail.logout()
#             except:
#                 pass

# if __name__ == "__main__":
#     emails = fetch_and_classify_emails()
#     for email_data in emails:
#         print(f"ID: {email_data['id']}")
#         print(f"Subject: {email_data['subject']}")
#         print(f"Category: {email_data['category']}")
#         print(f"Body:\n{email_data['body']}\n")


import os
import imaplib
import email
from email.header import decode_header
from bs4 import BeautifulSoup
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
EMAIL_HOST = "imap.gmail.com"
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
TIMEOUT = 15  # Connection timeout

# Initialize Gemini AI
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")  

def keyword_based_classification(subject, body):
    """Manually classify emails before AI processing based on keywords."""
    subject_lower = subject.lower()
    body_lower = body.lower()

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
    if category:
        return category  # Return if manually classified

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
    mail = None
    try:
        mail = imaplib.IMAP4_SSL(EMAIL_HOST, timeout=TIMEOUT)
        mail.login(EMAIL_USER, EMAIL_PASS)
        mail.select("inbox", readonly=True)
        
        status, messages = mail.search(None, 'UNSEEN')
        if status != "OK" or not messages[0]:
            print("No unread emails found.")
            return []

        email_ids = messages[0].split()[:15]  # Process up to 15 emails
        results = []

        for e_id in email_ids:
            try:
                _, msg_data = mail.fetch(e_id, "(RFC822)")
                msg = email.message_from_bytes(msg_data[0][1])
                
                # Decode subject
                subject = "(No Subject)"
                subject_header = decode_header(msg.get("Subject", ""))
                if subject_header and subject_header[0]:
                    subject_bytes, encoding = subject_header[0]
                    encoding = encoding or 'utf-8'
                    subject = subject_bytes.decode(encoding, errors='ignore') if isinstance(subject_bytes, bytes) else str(subject_bytes)

                # Extract email body
                body = extract_email_body(msg)

                # Classify email
                category = classify_email(subject, body)

                # Summarize email content
                summary = summarize_email_content(subject, body)

                results.append({
                    "id": e_id.decode(),
                    "subject": subject,
                    "category": category,
                    "summary": summary
                })
            except Exception as e:
                print(f"Error processing email ID {e_id.decode()}: {e}")
                continue

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
    for email_data in emails:
        print(f"ID: {email_data['id']}")
        print(f"Subject: {email_data['subject']}")
        print(f"Category: {email_data['category']}")
        print(f"Summary: {email_data['summary']}\n")