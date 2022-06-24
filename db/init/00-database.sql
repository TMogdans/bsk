\connect event-service-db

CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE OR REPLACE FUNCTION slugify("value" TEXT)
RETURNS TEXT AS $$
  -- removes accents (diacritic signs) from a given string --
  WITH "unaccented" AS (
    SELECT unaccent("value") AS "value"
  ),
  -- lowercases the string
  "lowercase" AS (
    SELECT lower("value") AS "value"
    FROM "unaccented"
  ),
  -- remove single and double quotes
  "removed_quotes" AS (
    SELECT regexp_replace("value", '[''"]+', '', 'gi') AS "value"
    FROM "lowercase"
  ),
  -- replaces anything that's not a letter, number, hyphen('-'), or underscore('_') with a hyphen('-')
  "hyphenated" AS (
    SELECT regexp_replace("value", '[^a-z0-9\-_]+', '-', 'gi') AS "value"
    FROM "removed_quotes"
  ),
  -- trims hyphens('-') if they exist on the head or tail of the string
  "trimmed" AS (
    SELECT trim(both '-' from "value") AS "value"
    FROM "hyphenated"
  )
SELECT "value" FROM "trimmed";
$$ LANGUAGE SQL STRICT IMMUTABLE;

CREATE FUNCTION public.set_slug_from_name() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
sql_string varchar;
tmp_slug varchar;
increment integer;
tmp_row record;
tmp_row_count integer;

BEGIN
    tmp_row_count = 1;
    increment = 0;
    while tmp_row_count > 0 LOOP

    if increment > 0 then
        tmp_slug = slugify(NEW.name || ' ' || increment::varchar);
    ELSE
        tmp_slug = slugify(NEW.name);
    end if;

      sql_string = format(' select count(1) cnt from ' || TG_TABLE_NAME || ' where slug = ''' || tmp_slug || '''; ');
    for tmp_row in  execute(sql_string)
      loop
        raise notice '%', tmp_row;
        tmp_row_count = tmp_row.cnt;
    end loop;

    increment = increment + 1;
    END LOOP;

    NEW.slug := tmp_slug;
    RETURN NEW;
END
$$;

CREATE TABLE public.types (
    id SERIAL PRIMARY KEY,
    name TEXT
);

COMMENT ON TABLE public.types IS 'Event type.';

CREATE TABLE public.events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    type_id BIGINT NOT NULL REFERENCES public.types(id),
    begins_at DATE DEFAULT CURRENT_DATE,
    ends_at DATE DEFAULT CURRENT_DATE,
    zip VARCHAR(20),
    location VARCHAR(255),
    country VARCHAR(255) NOT NULL,
    street VARCHAR(255),
    description TEXT,
    barrier_free BOOLEAN NOT NULL DEFAULT false,
    entry_free BOOLEAN NOT NULL DEFAULT false,
    online_event BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT false,
    event_url VARCHAR(255) NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

COMMENT ON TABLE public.events IS 'Boardgame event.';

CREATE TRIGGER "trg_slug_insert" BEFORE INSERT ON "events"
FOR EACH ROW WHEN (NEW.name IS NOT NULL AND NEW.slug IS NULL) EXECUTE PROCEDURE set_slug_from_name();
