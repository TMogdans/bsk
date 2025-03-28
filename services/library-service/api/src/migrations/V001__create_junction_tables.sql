-- Erstelle Verbindungstabelle für BoardGames und Awards
CREATE TABLE IF NOT EXISTS board_games_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_game_id UUID NOT NULL REFERENCES board_games(id) ON DELETE CASCADE,
  award_id UUID NOT NULL REFERENCES awards(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT board_games_awards_unique UNIQUE (board_game_id, award_id)
);

-- Erstelle Index für Award-bezogene Abfragen
CREATE INDEX IF NOT EXISTS idx_board_games_awards_award_id ON board_games_awards (award_id);
CREATE INDEX IF NOT EXISTS idx_board_games_awards_board_game_id ON board_games_awards (board_game_id);

-- Erstelle Verbindungstabelle für BoardGames und Categories
CREATE TABLE IF NOT EXISTS board_games_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_game_id UUID NOT NULL REFERENCES board_games(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT board_games_categories_unique UNIQUE (board_game_id, category_id)
);

-- Erstelle Index für Category-bezogene Abfragen
CREATE INDEX IF NOT EXISTS idx_board_games_categories_category_id ON board_games_categories (category_id);
CREATE INDEX IF NOT EXISTS idx_board_games_categories_board_game_id ON board_games_categories (board_game_id);

-- Erstelle Verbindungstabelle für BoardGames und Mechanics
CREATE TABLE IF NOT EXISTS board_games_mechanics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_game_id UUID NOT NULL REFERENCES board_games(id) ON DELETE CASCADE,
  mechanic_id UUID NOT NULL REFERENCES mechanics(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT board_games_mechanics_unique UNIQUE (board_game_id, mechanic_id)
);

-- Erstelle Index für Mechanic-bezogene Abfragen
CREATE INDEX IF NOT EXISTS idx_board_games_mechanics_mechanic_id ON board_games_mechanics (mechanic_id);
CREATE INDEX IF NOT EXISTS idx_board_games_mechanics_board_game_id ON board_games_mechanics (board_game_id);

-- Erstelle Verbindungstabelle für BoardGames und Publishers
CREATE TABLE IF NOT EXISTS board_games_publishers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_game_id UUID NOT NULL REFERENCES board_games(id) ON DELETE CASCADE,
  publisher_id UUID NOT NULL REFERENCES publishers(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT board_games_publishers_unique UNIQUE (board_game_id, publisher_id)
);

-- Erstelle Index für Publisher-bezogene Abfragen
CREATE INDEX IF NOT EXISTS idx_board_games_publishers_publisher_id ON board_games_publishers (publisher_id);
CREATE INDEX IF NOT EXISTS idx_board_games_publishers_board_game_id ON board_games_publishers (board_game_id);

-- Erstelle Verbindungstabelle für BoardGames und Designers (Persons)
CREATE TABLE IF NOT EXISTS board_games_designers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_game_id UUID NOT NULL REFERENCES board_games(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT board_games_designers_unique UNIQUE (board_game_id, person_id)
);

-- Erstelle Index für Designer-bezogene Abfragen
CREATE INDEX IF NOT EXISTS idx_board_games_designers_person_id ON board_games_designers (person_id);
CREATE INDEX IF NOT EXISTS idx_board_games_designers_board_game_id ON board_games_designers (board_game_id);

-- Erstelle Verbindungstabelle für BoardGames und Artists (Persons)
CREATE TABLE IF NOT EXISTS board_games_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_game_id UUID NOT NULL REFERENCES board_games(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT board_games_artists_unique UNIQUE (board_game_id, person_id)
);

-- Erstelle Index für Artist-bezogene Abfragen
CREATE INDEX IF NOT EXISTS idx_board_games_artists_person_id ON board_games_artists (person_id);
CREATE INDEX IF NOT EXISTS idx_board_games_artists_board_game_id ON board_games_artists (board_game_id);

-- Erstelle Verbindungstabelle für BoardGames und Links
CREATE TABLE IF NOT EXISTS board_games_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_game_id UUID NOT NULL REFERENCES board_games(id) ON DELETE CASCADE,
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT board_games_links_unique UNIQUE (board_game_id, link_id)
);

-- Erstelle Index für Link-bezogene Abfragen
CREATE INDEX IF NOT EXISTS idx_board_games_links_link_id ON board_games_links (link_id);
CREATE INDEX IF NOT EXISTS idx_board_games_links_board_game_id ON board_games_links (board_game_id);