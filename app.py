from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)
JSON_FILE = "update.json"

# Ensure update.json exists
if not os.path.exists(JSON_FILE):
    with open(JSON_FILE, "w") as f:
        json.dump({"user-email": "", "app-password": "", "Gemini-api-key": ""}, f)


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
