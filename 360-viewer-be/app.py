from flask import Flask, jsonify, request, send_from_directory
from flask_swagger_ui import get_swaggerui_blueprint
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from Controllers.PanoController import PanoController
from Controllers.PoiController import PoiController
from Repositories.PanoRepository import PanoRepository
from Repositories.PoiRepository import POIRepository
from Models.PanoModel import PanoModel
from Models.PoiModel import POIModel
from flask_cors import CORS
import uuid
import os


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
# Swagger UI configuration
SWAGGER_URL = "/docs"  # URL for accessing Swagger UI
API_URL = "/static/openapi.yaml"  # Path to OpenAPI YAML file

swagger_ui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={"app_name": "360 Viewer API"}
)

app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)
@app.route("/static/openapi.yaml")
def send_swagger():
    """Serve OpenAPI YAML file."""
    return send_from_directory(".", "openapi.yaml")


# Check if running in Azure App Service
if "WEBSITE_HOSTNAME" in os.environ:  
    DATABASE_DIR = "/home/data/"  # Azure writable directory
else:
    DATABASE_DIR = "./db/"  # Local writable directory

os.makedirs(DATABASE_DIR, exist_ok=True)
DATABASE_PATH = os.path.join(DATABASE_DIR, "360viewer.db")

DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

engine = create_engine(DATABASE_URL, echo=True, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
meta = MetaData()
meta.reflect(bind=engine)
poi_table = meta.tables["poi"]
pano_table = meta.tables.get("pano")

pano_repo, poi_repo = PanoRepository(SessionLocal, pano_table), POIRepository(SessionLocal, poi_table)
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
    app.run(port=8000, debug=True)
