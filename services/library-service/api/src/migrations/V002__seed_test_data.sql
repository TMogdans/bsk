-- Beispiel-Testdaten für die Entwicklung

-- Erzeuge einen System-Benutzer für die Testdaten (falls verwendbar)
DO $$
DECLARE
    system_user_id UUID := '00000000-0000-0000-0000-000000000000';
BEGIN

-- Beispiel-Awards einfügen
INSERT INTO awards (name, slug, description, created_by)
VALUES 
    ('Spiel des Jahres', 'spiel-des-jahres', 'Der wichtigste Preis für Brettspiele in Deutschland', system_user_id),
    ('Kennerspiel des Jahres', 'kennerspiel-des-jahres', 'Auszeichnung für anspruchsvollere Spiele', system_user_id),
    ('Deutscher Spielepreis', 'deutscher-spielepreis', 'Durch Publikumswahl vergebener Spielepreis', system_user_id)
ON CONFLICT (slug) DO NOTHING;

-- Beispiel-Kategorien einfügen
INSERT INTO categories (name, description, created_by)
VALUES 
    ('Strategie', 'Spiele mit starkem strategischen Element', system_user_id),
    ('Familie', 'Familienfreundliche Spiele für alle Altersgruppen', system_user_id),
    ('Kinder', 'Spiele speziell für jüngere Spieler entwickelt', system_user_id),
    ('Party', 'Gesellige Spiele für größere Gruppen', system_user_id),
    ('Kooperativ', 'Spiele, bei denen die Spieler zusammenarbeiten', system_user_id)
ON CONFLICT DO NOTHING;

-- Beispiel-Mechaniken einfügen
INSERT INTO mechanics (name, description, created_by)
VALUES 
    ('Deck Building', 'Spieler bauen während des Spiels ihr eigenes Kartendeck auf', system_user_id),
    ('Worker Placement', 'Spieler setzen ihre Arbeiter ein, um Aktionen durchzuführen', system_user_id),
    ('Würfelspiel', 'Stark vom Würfelglück abhängige Spiele', system_user_id),
    ('Kartenspiel', 'Spiele, die hauptsächlich mit Karten gespielt werden', system_user_id),
    ('Rollen und Bewegen', 'Klassischer Mechanismus: Würfeln und Figur bewegen', system_user_id)
ON CONFLICT DO NOTHING;

-- Beispiel-Verlage einfügen
INSERT INTO publishers (name, slug, description, created_by)
VALUES 
    ('Kosmos', 'kosmos', 'Deutscher Traditionsverlag für Spiele und Bücher', system_user_id),
    ('Asmodee', 'asmodee', 'Großer internationaler Spieleverlag', system_user_id),
    ('Ravensburger', 'ravensburger', 'Traditionsreicher deutscher Verlag für Spiele und Puzzles', system_user_id),
    ('Days of Wonder', 'days-of-wonder', 'Bekannt für hochwertige Familienspiele', system_user_id)
ON CONFLICT (slug) DO NOTHING;

-- Beispiel-Personen einfügen
INSERT INTO persons (first_name, last_name, description, created_by)
VALUES 
    ('Klaus', 'Teuber', 'Erfinder von Die Siedler von Catan', system_user_id),
    ('Reiner', 'Knizia', 'Einer der produktivsten Spieleautoren weltweit', system_user_id),
    ('Alan R.', 'Moon', 'Autor von Ticket to Ride', system_user_id),
    ('Doris', 'Matthäus', 'Renommierte Spielegrafikerin', system_user_id)
ON CONFLICT DO NOTHING;

-- Beispiel-Links einfügen
INSERT INTO links (url, title, description, created_by)
VALUES 
    ('https://www.catan.de', 'Offizielle Catan-Website', 'Die offizielle Website des Spiels Die Siedler von Catan', system_user_id),
    ('https://www.daysofwonder.com/tickettoride', 'Ticket to Ride Website', 'Offizielle Website für Ticket to Ride', system_user_id)
ON CONFLICT DO NOTHING;

-- Beispiel-Brettspiele einfügen
INSERT INTO board_games (name, description, min_number_of_players, max_number_of_players, min_play_time_minutes, max_play_time_minutes, min_age, year_published, created_by)
VALUES 
    ('Die Siedler von Catan', 'Baue Siedlungen, Städte und Straßen auf der Insel Catan', 3, 4, 75, 90, 10, 1995, system_user_id),
    ('Ticket to Ride', 'Baue ein Eisenbahnnetz über Nordamerika', 2, 5, 30, 60, 8, 2004, system_user_id),
    ('Carcassonne', 'Lege Landschaftsplättchen an und setze deine Gefolgsleute ein', 2, 5, 30, 45, 7, 2000, system_user_id)
ON CONFLICT DO NOTHING;

-- Verbindungen zwischen Brettspielen und Verlagen herstellen
WITH
    bg_catan AS (SELECT id FROM board_games WHERE name = 'Die Siedler von Catan' LIMIT 1),
    bg_ticket AS (SELECT id FROM board_games WHERE name = 'Ticket to Ride' LIMIT 1),
    pub_kosmos AS (SELECT id FROM publishers WHERE name = 'Kosmos' LIMIT 1),
    pub_dow AS (SELECT id FROM publishers WHERE name = 'Days of Wonder' LIMIT 1)
INSERT INTO board_games_publishers (board_game_id, publisher_id)
SELECT bg_catan.id, pub_kosmos.id FROM bg_catan, pub_kosmos
UNION
SELECT bg_ticket.id, pub_dow.id FROM bg_ticket, pub_dow
ON CONFLICT DO NOTHING;

-- Verbindungen zwischen Brettspielen und Kategorien herstellen
WITH
    bg_catan AS (SELECT id FROM board_games WHERE name = 'Die Siedler von Catan' LIMIT 1),
    bg_ticket AS (SELECT id FROM board_games WHERE name = 'Ticket to Ride' LIMIT 1),
    cat_strategy AS (SELECT id FROM categories WHERE name = 'Strategie' LIMIT 1),
    cat_family AS (SELECT id FROM categories WHERE name = 'Familie' LIMIT 1)
INSERT INTO board_games_categories (board_game_id, category_id)
SELECT bg_catan.id, cat_strategy.id FROM bg_catan, cat_strategy
UNION
SELECT bg_catan.id, cat_family.id FROM bg_catan, cat_family
UNION
SELECT bg_ticket.id, cat_family.id FROM bg_ticket, cat_family
ON CONFLICT DO NOTHING;

-- Verbindungen zwischen Brettspielen und Mechanismen herstellen
WITH
    bg_catan AS (SELECT id FROM board_games WHERE name = 'Die Siedler von Catan' LIMIT 1),
    bg_ticket AS (SELECT id FROM board_games WHERE name = 'Ticket to Ride' LIMIT 1),
    mech_dice AS (SELECT id FROM mechanics WHERE name = 'Würfelspiel' LIMIT 1),
    mech_cards AS (SELECT id FROM mechanics WHERE name = 'Kartenspiel' LIMIT 1)
INSERT INTO board_games_mechanics (board_game_id, mechanic_id)
SELECT bg_catan.id, mech_dice.id FROM bg_catan, mech_dice
UNION
SELECT bg_catan.id, mech_cards.id FROM bg_catan, mech_cards
UNION
SELECT bg_ticket.id, mech_cards.id FROM bg_ticket, mech_cards
ON CONFLICT DO NOTHING;

-- Verbindungen zwischen Brettspielen und Designern herstellen
WITH
    bg_catan AS (SELECT id FROM board_games WHERE name = 'Die Siedler von Catan' LIMIT 1),
    bg_ticket AS (SELECT id FROM board_games WHERE name = 'Ticket to Ride' LIMIT 1),
    des_teuber AS (SELECT id FROM persons WHERE last_name = 'Teuber' LIMIT 1),
    des_moon AS (SELECT id FROM persons WHERE last_name = 'Moon' LIMIT 1)
INSERT INTO board_games_designers (board_game_id, person_id)
SELECT bg_catan.id, des_teuber.id FROM bg_catan, des_teuber
UNION
SELECT bg_ticket.id, des_moon.id FROM bg_ticket, des_moon
ON CONFLICT DO NOTHING;

-- Verbindungen zwischen Brettspielen und Künstlern herstellen
WITH
    bg_catan AS (SELECT id FROM board_games WHERE name = 'Die Siedler von Catan' LIMIT 1),
    art_matthaeus AS (SELECT id FROM persons WHERE last_name = 'Matthäus' LIMIT 1)
INSERT INTO board_games_artists (board_game_id, person_id)
SELECT bg_catan.id, art_matthaeus.id FROM bg_catan, art_matthaeus
ON CONFLICT DO NOTHING;

END $$;