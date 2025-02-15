from sqlalchemy import select, update, delete
from Models.PanoModel import PanoModel

class PanoRepository:
    def __init__(self, session_factory, pano_table):
        self.session_factory = session_factory
        self.pano_table = pano_table

    def get_all_panos(self):
        """Retrieve all Panos from the database."""
        with self.session_factory() as session:
            query = select(self.pano_table)
            results = session.execute(query).fetchall()

            if not results:
                print("⚠ No Panos found in the database!")
                return []

            return [dict(row._mapping) for row in results] 

    def get_pano(self, pano_id: int):
        """Retrieve a Pano by ID."""
        with self.session_factory() as session:
            query = select(self.pano_table).where(self.pano_table.c.id == pano_id)
            result = session.execute(query).fetchone()

            if not result:
                print(f"❌ No Pano found with ID {pano_id}")
                return None

            return dict(result._mapping) 

    def add_pano(self, pano_data: PanoModel):
        """Insert a new Pano into the database."""
        session = self.session_factory()
        try:
            query = self.pano_table.insert().values(
                id=pano_data.id,
                preview=pano_data.preview,
                url=pano_data.url,
                title=pano_data.title
            )
            session.execute(query)
            session.commit()
            return {"message": "Pano added successfully", "id": pano_data.id}

        except Exception as e:
            session.rollback()
            print(f"❌ Error adding Pano: {e}")
            return {"error": str(e)}

        finally:
            session.close()

    def update_pano(self, pano_id: int, updated_data: PanoModel):
        """Update an existing Pano."""
        session = self.session_factory()
        try:
            query = update(self.pano_table).where(self.pano_table.c.id == pano_id).values(
                preview=updated_data.preview,
                url=updated_data.url,
                title=updated_data.title
            )
            result = session.execute(query)
            session.commit()

            if result.rowcount == 0:
                print(f"❌ No Pano found with ID {pano_id}")
                return {"error": "Pano not found"}

            return {"message": "Pano updated successfully"}

        except Exception as e:
            session.rollback()
            print(f"❌ Error updating Pano: {e}")
            return {"error": str(e)}

        finally:
            session.close()

    def delete_pano(self, pano_id: int):
        """Delete a Pano by ID."""
        session = self.session_factory()
        try:
            query = delete(self.pano_table).where(self.pano_table.c.id == pano_id)
            result = session.execute(query)
            session.commit()

            if result.rowcount == 0:
                print(f"❌ No Pano found with ID {pano_id}")
                return {"error": "Pano not found"}

            return {"message": "Pano deleted successfully"}

        except Exception as e:
            session.rollback()
            print(f"❌ Error deleting Pano: {e}")
            return {"error": str(e)}

        finally:
            session.close()
