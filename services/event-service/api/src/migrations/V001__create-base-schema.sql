-- Create types table
CREATE TABLE IF NOT EXISTS types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type_id INTEGER NOT NULL REFERENCES types(id),
  begins_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP NOT NULL,
  zip VARCHAR(255),
  location VARCHAR(255),
  country VARCHAR(2) NOT NULL,
  street VARCHAR(255),
  description TEXT NOT NULL,
  barrier_free BOOLEAN NOT NULL DEFAULT false,
  entry_free BOOLEAN NOT NULL DEFAULT false,
  online_event BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  event_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by INTEGER NOT NULL
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_events_slug ON events (slug);

-- Create index on begins_at for date-based queries
CREATE INDEX IF NOT EXISTS idx_events_begins_at ON events (begins_at);

-- Create index for type filtering
CREATE INDEX IF NOT EXISTS idx_events_type_id ON events (type_id);