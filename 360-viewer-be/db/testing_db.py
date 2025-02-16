import sqlite3

# Path to the database file
DB_PATH = "../360viewer.db"  # Adjust path based on where test_db.py is located

def test_query():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Execute query
        cursor.execute("SELECT * FROM poi;")
        rows = cursor.fetchall()
        
        # Print results
        if rows:
            for row in rows:
                print(row)
        else:
            print("No data found in 'poi' table!")

        # Close connection
        conn.close()

    except sqlite3.Error as e:
        print(f"SQLite error: {e}")

if __name__ == "__main__":
    test_query()
