# main_api.py
import matplotlib
matplotlib.use('Agg')  # Keep this if Senzor class relies on it internally, though plotting is removed

# Import jsonify for API responses and CORS for cross-origin requests
from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
import json
import requests
from datetime import datetime

class Senzor():
    def __init__(self, locatie_json):
        self.__locatie_json = locatie_json

        # Check if the location is a URL or local file
        if locatie_json.startswith("http"):
            try:
                response = requests.get(self.__locatie_json)
                response.raise_for_status() # Raise an exception for bad status codes
                date_json = json.loads(response.text)
            except requests.exceptions.RequestException as e:
                print(f"Error fetching data from {locatie_json}: {e}")
                self.inregistrari = []
                return
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON from {locatie_json}: {e}")
                self.inregistrari = []
                return
        else:
            # Assuming JSON files are in the same directory as the script
            try:
                with open(locatie_json, 'r') as file:
                    date_json = json.load(file)
            except FileNotFoundError:
                print(f"Error: File not found at {locatie_json}")
                self.inregistrari = []
                return # Stop initialization if file not found
            except json.JSONDecodeError as e:
                 print(f"Error decoding JSON from {locatie_json}: {e}")
                 self.inregistrari = []
                 return

        # Extract and reverse the recordings
        self.inregistrari = date_json.get("data", [])[::-1] # Use .get for safety

    @property
    def nr_inregistrari(self):
        return len(self.inregistrari)


class SenzorPV(Senzor):
    def __init__(self, locatie_json, tip_senzor, unitate_de_masura):
        super().__init__(locatie_json)
        # Initialize attributes even if loading fails
        self.tip_senzor = tip_senzor
        self.unitate_de_masura = unitate_de_masura
        self.nr_pes = None # Default value

        # Only proceed if inregistrari were loaded successfully
        if not self.inregistrari:
            print(f"Warning: No recordings loaded for {locatie_json}. PES ID will be None.")
            return

        # Public Electricity Supplier (PES) ID from the first element of the first record
        if self.inregistrari and len(self.inregistrari[0]) > 0:
            self.nr_pes = self.inregistrari[0][0]
        else:
             print(f"Warning: Could not determine PES ID from first record for {locatie_json}.")


    def get_data_for_api(self):
        """ Prepares data in a format suitable for API response. """
        if not self.inregistrari:
            return {
                "timestamps": [],
                "values": [],
                "pes_id": self.nr_pes, # Still return PES ID if known, even if no data points
                "unit": self.unitate_de_masura,
                "total_records": 0,
                "last_record": None,
                "last_timestamp": None,
                "last_value": None,
                "error": "No recordings data available for this sensor." # Add an error field
            }

        timestamps = []
        values = []
        for inregistrare in self.inregistrari:
             # Ensure record has enough elements and correct types
            if len(inregistrare) >= 3:
                timestamp_str = inregistrare[1]
                value = inregistrare[2]
                # Basic type check
                if not isinstance(timestamp_str, str) or not isinstance(value, (int, float)):
                     print(f"Skipping record due to unexpected type: {inregistrare}")
                     continue

                 # Convert timestamp format if needed for charting libraries
                try:
                    # Validate timestamp format, but keep original string for response
                    datetime.strptime(timestamp_str, '%Y-%m-%dT%H:%M:%SZ')
                    timestamps.append(timestamp_str) # Keep original ISO format string
                    values.append(value)
                except (ValueError, TypeError):
                     # Handle potential errors in data format gracefully
                    print(f"Skipping record due to timestamp format error: {inregistrare}")
                    continue # Skip this record
            else:
                print(f"Skipping record due to insufficient length: {inregistrare}")


        last_record = self.inregistrari[-1] if self.inregistrari else None
        last_timestamp = last_record[1] if last_record and len(last_record) > 1 else None
        last_value = last_record[2] if last_record and len(last_record) > 2 else None

        return {
            "timestamps": timestamps,
            "values": values,
            "pes_id": self.nr_pes,
            "unit": self.unitate_de_masura,
            "total_records": self.nr_inregistrari,
            "last_record": last_record, # Includes PES ID, Timestamp, Value
            "last_timestamp": last_timestamp,
            "last_value": last_value
        }

# Initialize Flask App
app = Flask(__name__)
# Enable CORS for all routes, allowing requests from any origin
CORS(app)

# Define sensor data sources (using local files as in the original example)
# Ensure these JSON files are in the same directory as this script, or provide full paths.
senzori = [
    SenzorPV("10.json", "PV", "mW"), # Index 0
    SenzorPV("11.json", "PV", "mW"), # Index 1
    SenzorPV("12.json", "PV", "mW")  # Index 2
]

# API endpoint to get data for a specific sensor
@app.route("/api/sensor/<int:index>") # Use <int:index> to capture the number
def get_sensor_data(index):
    if 0 <= index < len(senzori):
        sensor = senzori[index]
        sensor_data = sensor.get_data_for_api()
        # Even if sensor_data has an error field from get_data_for_api, return it with 200 OK
        # The client can check for the 'error' field in the JSON response
        return jsonify(sensor_data)
    else:
        # Return an error if the index is out of bounds
        return jsonify({"error": "Sensor index out of range"}), 404

# Optional: Add a simple root endpoint for testing
@app.route("/")
def api_home():
    return jsonify({
        "message": "Sensor API is running.",
        "available_sensors": len(senzori),
        "endpoints": [f"/api/sensor/{i}" for i in range(len(senzori))]
        })

if __name__ == "__main__":
    # Run the Flask app on port 8080, accessible on your network
    # Use debug=False for production
    app.run(debug=True, port=8080, host='0.0.0.0')