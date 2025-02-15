from flask import Flask, jsonify, request
import uuid

app = Flask(__name__)

# Mock Database (Dictionary)
pois = {}

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
        "pano_url": data.get("pano_url", ""),
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
        "pano_url": data.get("pano_url", pois[poi_id]["pano_url"]),
    })
    return jsonify({"message": "POI updated", "poi": pois[poi_id]})

### 5. Delete a POI
@app.route("/pois/<poi_id>", methods=["DELETE"])
def delete_poi(poi_id):
    if poi_id in pois:
        del pois[poi_id]
        return jsonify({"message": "POI deleted"})
    return jsonify({"error": "POI not found"}), 404

### 6. Get All panos
@app.route("/panos", methods=["GET"])
def get_all_panos():
    return jsonify({"error": "pano not found"}), 404


### 7. Get a Specific pano
@app.route("/panos/<pono_id>", methods=["GET"])
def get_pano(id):
    return jsonify({"error": "pano not found"}), 404

# Run Flask App
if __name__ == "__main__":
    app.run(debug=True)
