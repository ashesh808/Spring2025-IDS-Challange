from Models.PoiModel import POIModel
from Repositories.PoiRepository import POIRepository

class PoiController:
    def __init__(self, poi_repository : POIRepository):
        self.poi_repo = poi_repository

    def get_all_pois(self):
        """Returns a list of all POIs."""
        return self.poi_repo.get_all_pois()

    def get_poi(self, poi_id: int):
        """Returns a single POI by ID."""
        poi = self.poi_repo.get_poi(poi_id)
        if not poi:
            return {"error": f"POI with ID {poi_id} not found."}
        return poi

    def add_poi(self, poi_data: POIModel):
        """Adds a new POI to the database."""
        try:
            self.poi_repo.add_poi(poi_data)
        except Exception as e:
            return {"error": f"Failed to add POI: {str(e)}"}

    def update_poi(self, poi_id: int, update_data: POIModel):
        """Updates an existing POI by ID."""
        updated_poi = self.poi_repo.update_poi(poi_id, update_data)
        if not updated_poi:
            return {"error": f"POI with ID {poi_id} not found."}
        return updated_poi

    def delete_poi(self, poi_id: int):
        """Deletes a POI from the database."""
        result = self.poi_repo.delete_poi(poi_id)
        if "error" in result:
            return {"error": f"POI with ID {poi_id} not found."}
        return result