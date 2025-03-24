import threading
import time
import subprocess
from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)
JSON_FILE = "update.json"

# Ensure update.json exists
if not os.path.exists(JSON_FILE):
    with open(JSON_FILE, "w") as f:
        json.dump({"user-email": "", "app-password": "", "Gemini-api-key": ""}, f)

# Background task to run main.py every minute
def run_main_script():
    """Runs main.py every 1 minute in the background."""
    while True:
        print("Executing main.py...")
        subprocess.run(["python", "main.py"])  # Run main.py
        time.sleep(60)  # Wait 1 minute before running again

# Start the background thread when the server starts
thread = threading.Thread(target=run_main_script, daemon=True)
thread.start()

# Endpoint to get stored credentials
@app.route("/get_credentials", methods=["GET"])
def get_credentials():
    with open(JSON_FILE, "r") as f:
        data = json.load(f)
    return jsonify(data)

# Endpoint to update credentials
@app.route("/update_credentials", methods=["POST"])
def update_credentials():
    new_data = request.json  # Get data from Chrome extension
    with open(JSON_FILE, "r+") as f:
        data = json.load(f)
        data.update(new_data)  # Update values
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()
    return jsonify({"message": "Credentials updated successfully"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
