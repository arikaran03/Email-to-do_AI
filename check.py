import google.generativeai as genai

genai.configure(api_key="AIzaSyBnScEqDwpc65eGcNz7Ogai9hO35gv9CP8")

model = genai.GenerativeModel("gemini-1.5-pro-latest")  # Use a valid model
response = model.generate_content("Hello, how are you?")
print(response.text)