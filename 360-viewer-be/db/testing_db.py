import sqlite3

DB_PATH = "360viewer.db"  # Adjust the path if needed

def test_query():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Enable foreign key constraints (needed if poi has related entries)
        cursor.execute("PRAGMA foreign_keys = ON;")

        # Delete all rows from poi
        cursor.execute("DELETE FROM poi;")
        conn.commit()  # Ensure changes are saved

        # Verify deletion
        cursor.execute("SELECT * FROM poi;")
        rows = cursor.fetchall()

        # Print results
        if rows:
            print("Rows still present in 'poi' table:")
            for row in rows:
                print(row)
        else:
            print("All POIs deleted successfully!")

        # Close connection
        conn.close()

    except sqlite3.Error as e:
        print(f"SQLite error: {e}")

if __name__ == "__main__":
    test_query()
