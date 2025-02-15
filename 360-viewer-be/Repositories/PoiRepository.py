from sqlalchemy.orm import Session
from sqlalchemy import Table, select
from Models.PoiModel import POIModel

class POIRepository:
    def __init__(self, session_factory, poi_table: Table):
        """Dependency Injection of Session and Table"""
        self.session_factory = session_factory
        self.poi_table = poi_table

    def get_all_pois(self):
        """Retrieve all POIs"""
        with self.session_factory() as session:
            query = select(self.poi_table)
            results = session.execute(query).fetchall()
            pois = [dict(row._mapping) for row in results] 
            return pois

    def get_poi(self, poi_id: int):
        """Retrieve a POI by ID"""
        with self.session_factory() as session:
            query = select(self.poi_table).where(self.poi_table.c.id == poi_id)
            result = session.execute(query).fetchone()
            return dict(result) if result else None
    
    def add_poi(self, poi_data: POIModel):
        """Insert a new POI into the database and debug rollback issues"""
        session = self.session_factory()
        try:
            print(f"🟢 Inserting POI: {poi_data}")  # Debug
            query = self.poi_table.insert().values(
                id=poi_data.id,
                pano_id=1,
                name=poi_data.name,
                description=poi_data.description,
                type=poi_data.type,
                ath=poi_data.ath,
                atv=poi_data.atv,
                video=poi_data.video,
                pdf=poi_data.pdf
            )
            session.execute(query)
            session.commit()
            print("✅ POI added successfully!")
            return {"message": "POI added successfully", "id": poi_data.id}
        except Exception as e:
            session.rollback()
            print(f"❌ Error inserting POI: {e}")  # Debug rollback error
            return {"error": str(e)}
        finally:
            session.close()


    def update_poi(self, poi_id: int, updated_data: dict):
        """Update an existing POI"""
        try:
            with self.session_factory() as session:
                query = self.poi_table.update().where(self.poi_table.c.id == poi_id).values(updated_data)
                result = session.execute(query)
                session.commit()
                if result.rowcount == 0:
                    return {"error": "POI not found"}
            return {"message": "POI updated successfully"}
        except Exception as e:
            return {"error": str(e)}

    def delete_poi(self, poi_id: int):
        """Delete a POI by ID"""
        try:
            with self.session_factory() as session:
                query = self.poi_table.delete().where(self.poi_table.c.id == poi_id)
                result = session.execute(query)
                session.commit()
                if result.rowcount == 0:
                    return {"error": "POI not found"}
            return {"message": "POI deleted successfully"}
        except Exception as e:
            return {"error": str(e)}
