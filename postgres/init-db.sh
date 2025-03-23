#!/bin/bash
set -e

# This script runs when the postgres container starts
# It creates the required databases if they don't exist
# and sets up proper permissions

# Wait for PostgreSQL to start
until pg_isready -h localhost -U postgres; do
  echo "Waiting for postgres to start..."
  sleep 2
done

echo "PostgreSQL started, creating databases..."

# Function to create a database if it doesn't exist
create_db_if_not_exists() {
  DB_NAME=$1
  echo "Checking if database $DB_NAME exists..."
  
  # Check if database exists
  DB_EXISTS=$(psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
  
  if [ "$DB_EXISTS" != "1" ]; then
    echo "Creating database $DB_NAME..."
    psql -U postgres -c "CREATE DATABASE $DB_NAME"
    echo "Database $DB_NAME created successfully."
  else
    echo "Database $DB_NAME already exists."
  fi
}

# Create all required databases
create_db_if_not_exists "events"
create_db_if_not_exists "rating_write"
create_db_if_not_exists "rating_read"
create_db_if_not_exists "library"

echo "Database initialization completed successfully!"