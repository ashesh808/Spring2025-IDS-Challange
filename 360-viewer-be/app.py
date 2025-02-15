from flask import Flask, jsonify, request, send_from_directory
import os
import uuid

app = Flask(__name__)

# Mock Database (Dictionary)
pois = {}

# Directory for storing images
IMAGE_FOLDER = "public/images"
os.makedirs(IMAGE_FOLDER, exist_ok=True)

### 1. Get All POIs
@app.route("/pois", methods=["GET"])
def get_all_pois():
    return jsonify({"pois": list(pois.values())})

### 2. Create a New POI
@app.route("/pois", methods=["POST"])
def create_poi():
    data = request.json
    poi_id = str(uuid.uuid4())  # Generate a unique ID
    new_poi = {
        "id": poi_id,
        "name": data.get("name", ""),
        "ath": data.get("ath", 0),
        "atv": data.get("atv", 0),
        "description": data.get("description", ""),
        "image_url": data.get("image_url", ""),
    }
    pois[poi_id] = new_poi
    return jsonify({"message": "POI created", "poi": new_poi}), 201

### 3. Get a Single POI
@app.route("/pois/<poi_id>", methods=["GET"])
def get_poi(poi_id):
    poi = pois.get(poi_id)
    if not poi:
        return jsonify({"error": "POI not found"}), 404
    return jsonify(poi)

### 4. Update an Existing POI
@app.route("/pois/<poi_id>", methods=["PUT"])
def update_poi(poi_id):
    if poi_id not in pois:
        return jsonify({"error": "POI not found"}), 404

    data = request.json
    pois[poi_id].update({
        "name": data.get("name", pois[poi_id]["name"]),
        "ath": data.get("ath", pois[poi_id]["ath"]),
        "atv": data.get("atv", pois[poi_id]["atv"]),
        "description": data.get("description", pois[poi_id]["description"]),
        "image_url": data.get("image_url", pois[poi_id]["image_url"]),
    })
    return jsonify({"message": "POI updated", "poi": pois[poi_id]})

### 5. Delete a POI
@app.route("/pois/<poi_id>", methods=["DELETE"])
def delete_poi(poi_id):
    if poi_id in pois:
        del pois[poi_id]
        return jsonify({"message": "POI deleted"})
    return jsonify({"error": "POI not found"}), 404

### 6. Get All Images
@app.route("/images", methods=["GET"])
def get_all_images():
    images = os.listdir(IMAGE_FOLDER)
    return jsonify({"images": images})

### 7. Get a Specific Image
@app.route("/images/<filename>", methods=["GET"])
def get_image(filename):
    image_path = os.path.join(IMAGE_FOLDER, filename)
    if os.path.exists(image_path):
        return send_from_directory(IMAGE_FOLDER, filename)
    return jsonify({"error": "Image not found"}), 404

# Run Flask App
if __name__ == "__main__":
    app.run(debug=True)
