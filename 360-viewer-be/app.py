from flask import Flask, jsonify, request
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from Controllers.PanoController import PanoController
from Controllers.PoiController import PoiController
from Repositories.PanoRepository import PanoRepository
from Repositories.PoiRepository import POIRepository
from Models.PanoModel import PanoModel
from Models.PoiModel import POIModel
import uuid

app = Flask(__name__)

DATABASE_URL = "sqlite:///360viewer.db"
engine = create_engine(DATABASE_URL, echo=True, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
meta = MetaData()
meta.reflect(bind=engine)
poi_table = meta.tables["poi"]


pano_repo, poi_repo = PanoRepository(), POIRepository(SessionLocal, poi_table)
pano_controller, poi_controller = PanoController(pano_repo), PoiController(poi_repo)

@app.route("/pois", methods=["GET"])
def get_all_pois():
    return jsonify(poi_controller.get_all_pois())

@app.route("/pois", methods=["POST"])
def create_poi():
    data = request.json
    poi_id = int(uuid.uuid4().int % 10**9)
    try:
        new_poi = POIModel(
            id=poi_id,
            name=data.get("name", ""),
            ath=float(data.get("ath", 0)),
            atv=float(data.get("atv", 0)),
            type=data.get("type", ""),
            description=data.get("description", ""),
            pdf=data.get("pdf", ""),
            video=data.get("video", "")
        )
    except Exception as e:
        return jsonify({"error": f"Invalid data: {str(e)}"}), 400
    poi_controller.add_poi(new_poi)
    return jsonify({"id": poi_id, "message": "POI created successfully"}), 201

@app.route("/pois/<poi_id>", methods=["GET"])
def get_poi(poi_id):
    response = poi_controller.get_poi(poi_id)
    if not response:
        return jsonify({"error": "POI not found"}), 404
    return jsonify(response)

@app.route("/pois/<poi_id>", methods=["PUT"])
def update_poi(poi_id):
    data = request.json
    response = poi_controller.update_poi(poi_id, data)
    if "error" in response:
        return jsonify(response), 404
    return jsonify({"message": "POI updated", "poi": response})

@app.route("/pois/<poi_id>", methods=["DELETE"])
def delete_poi(poi_id):
    response = poi_controller.delete_poi(poi_id)
    if "error" in response:
        return jsonify(response), 404
    return jsonify({"message": "POI deleted"})

@app.route("/panos", methods=["GET"])
def get_all_panos():
    return jsonify(pano_controller.get_all_panos())

@app.route("/panos/<pano_id>", methods=["GET"])
def get_pano(pano_id):
    response = pano_controller.get_pano(pano_id)
    if not response:
        return jsonify({"error": "Panorama not found"}), 404
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
