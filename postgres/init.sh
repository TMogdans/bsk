#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE events;
    CREATE DATABASE rating_write;
    CREATE DATABASE rating_read;
    CREATE DATABASE library;
EOSQL