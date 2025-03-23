#!/bin/bash

# This script can be run manually to create the required databases
# Usage: ./create-databases.sh

echo "Creating necessary databases..."

# Connect to running postgres container
docker exec -it postgres psql -U postgres -c "CREATE DATABASE events;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE rating_write;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE rating_read;"
docker exec -it postgres psql -U postgres -c "CREATE DATABASE library;"

echo "Databases created!"
echo "You can verify by running: docker exec -it postgres psql -U postgres -c '\l'"