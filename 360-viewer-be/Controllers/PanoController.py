from Models.PanoModel import PanoModel

class PanoController:
    def __init__(self, pano_repository):
        self.pano_repo = pano_repository

    def get_all_panos(self):
        """Returns a list of all POIs."""
        return self.pano_repo.get_all_pois()

    def get_pano(self, pano_id: int):
        """Returns a single POI by ID."""
        poi = self.pano_repo.get_poi(pano_id)
        if not poi:
            return {"error": f"POI with ID {pano_id} not found."}
        return poi

    def add_pano(self, pano_data: PanoModel):
        """Adds a new POI to the database."""
        try:
            self.pano_repo.add_pano(pano_data)
        except Exception as e:
            return {"error": f"Failed to add POI: {str(e)}"}

    def update_pano(self, pano_id: int, update_data: PanoModel):
        """Updates an existing POI by ID."""
        updated_poi = self.pano_repo.update_poi(pano_id, update_data)
        if not updated_poi:
            return {"error": f"POI with ID {pano_id} not found."}
        return updated_poi

    def delete_pano(self, pano_id: int):
        """Deletes a POI from the database."""
        result = self.pano_repo.delete_poi(pano_id)
        if "error" in result:
            return {"error": f"POI with ID {pano_id} not found."}
        return result