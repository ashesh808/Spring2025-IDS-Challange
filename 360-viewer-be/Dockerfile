# Use official Python image
FROM python:3.12

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Ensure writable directory for SQLite
RUN mkdir -p /home/data

# Copy the database file
COPY db/360viewer.db /home/data/360viewer.db

# Set correct permissions for SQLite
RUN chmod 777 /home/data/360viewer.db

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Gunicorn explicitly
RUN pip install --no-cache-dir gunicorn

# Expose port
EXPOSE 8000

# Run Flask app with Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
