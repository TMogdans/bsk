-- Erstelle base tables for library-service

-- Erstelle awards Tabelle
CREATE TABLE IF NOT EXISTS awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID NOT NULL
);

-- Erstelle categories Tabelle
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID NOT NULL
);

-- Erstelle mechanics Tabelle
CREATE TABLE IF NOT EXISTS mechanics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID NOT NULL
);

-- Erstelle publishers Tabelle
CREATE TABLE IF NOT EXISTS publishers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID NOT NULL
);

-- Erstelle persons Tabelle
CREATE TABLE IF NOT EXISTS persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID NOT NULL
);

-- Erstelle links Tabelle
CREATE TABLE IF NOT EXISTS links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url VARCHAR(2048) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID NOT NULL
);

-- Erstelle board_games Tabelle
CREATE TABLE IF NOT EXISTS board_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_number_of_players INTEGER,
    max_number_of_players INTEGER,
    min_play_time_minutes INTEGER,
    max_play_time_minutes INTEGER,
    min_age INTEGER,
    year_published INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    created_by UUID NOT NULL
);

-- Erstelle Indizes für häufige Abfragen
CREATE INDEX IF NOT EXISTS idx_awards_name ON awards (name);
CREATE INDEX IF NOT EXISTS idx_awards_slug ON awards (slug);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories (name);
CREATE INDEX IF NOT EXISTS idx_mechanics_name ON mechanics (name);
CREATE INDEX IF NOT EXISTS idx_publishers_name ON publishers (name);
CREATE INDEX IF NOT EXISTS idx_publishers_slug ON publishers (slug);
CREATE INDEX IF NOT EXISTS idx_persons_name ON persons (last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_board_games_name ON board_games (name);

-- Erstelle Indizes für Soft-Delete Operationen
CREATE INDEX IF NOT EXISTS idx_awards_deleted_at ON awards (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_categories_deleted_at ON categories (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_mechanics_deleted_at ON mechanics (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_publishers_deleted_at ON publishers (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_persons_deleted_at ON persons (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_links_deleted_at ON links (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_board_games_deleted_at ON board_games (deleted_at) WHERE deleted_at IS NULL;