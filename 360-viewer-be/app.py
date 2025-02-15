from flask import Flask, jsonify, request
from Controllers.PanoController import PanoController
from Controllers.PoiController import PoiController
from Repositories.PanoRepository import PanoRepository
from Repositories.PoiRepository import POIRepository
from Models.PanoModel import PanoModel
from Models.PoiModel import POIModel
import uuid

app = Flask(__name__)

pano_repo, poi_repo = PanoRepository(), POIRepository()
pano_controller, poi_controller = PanoController(pano_repo), PoiController(poi_repo)

# 1. Get All POIs
@app.route("/pois", methods=["GET"])
def get_all_pois():
    return jsonify(poi_controller.get_all_pois())

# 2. Create a New POI
@app.route("/pois", methods=["POST"])
def create_poi():
    data = request.json
    poi_id = str(uuid.uuid4())  # Generate a unique ID

    try:
        new_poi = POIModel(
            id=poi_id,
            name=data.get("name", ""),
            ath=data.get("ath", 0),
            atv=data.get("atv", 0),
            type=data.get("type", ""),
            description=data.get("description", ""),
            pdf=data.get("pdf", ""),
            video=data.get("video", "")
        )
    except Exception as e:
        return jsonify({"error": f"Invalid data: {str(e)}"}), 400
    response = poi_controller.add_poi(new_poi)
    return jsonify(response), 201

# 3. Get a Single POI
@app.route("/pois/<poi_id>", methods=["GET"])
def get_poi(poi_id):
    response = poi_controller.get_poi(poi_id)
    if not response:
        return jsonify({"error": "POI not found"}), 404
    return jsonify(response)

# 4. Update an Existing POI
@app.route("/pois/<poi_id>", methods=["PUT"])
def update_poi(poi_id):
    data = request.json
    response = poi_controller.update_poi(poi_id, data)
    if "error" in response:
        return jsonify(response), 404
    return jsonify({"message": "POI updated", "poi": response})

# 5. Delete a POI
@app.route("/pois/<poi_id>", methods=["DELETE"])
def delete_poi(poi_id):
    response = poi_controller.delete_poi(poi_id)
    if "error" in response:
        return jsonify(response), 404
    return jsonify({"message": "POI deleted"})

# 6. Get All Panoramas
@app.route("/panos", methods=["GET"])
def get_all_panos():
    return jsonify(pano_controller.get_all_panos())

# 7. Get a Specific Panorama
@app.route("/panos/<pano_id>", methods=["GET"])
def get_pano(pano_id):
    response = pano_controller.get_pano(pano_id)
    if not response:
        return jsonify({"error": "Panorama not found"}), 404
    return jsonify(response)

# Run Flask App
if __name__ == "__main__":
    app.run(debug=True)
