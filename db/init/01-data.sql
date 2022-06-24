\connect event-service-db

INSERT INTO public.types (name)
VALUES ('convention'),
       ('fair'),
       ('tournament'),
       ('release'),
       ('award'),
       ('other');

INSERT INTO public.events (name, type_id, begins_at, ends_at, zip, location, country, street, description, barrier_free,
                           entry_free, online_event, published, event_url, deleted_at, created_by)
VALUES ('Testevent', 1, now(), now(), '98765', 'Musterstadt', 'de', 'Mustergasse 42b', 'lorem ipsum', true, true, false,
        true, 'https://some.url', null, 1),
       ('Testevent Offline', 2, now(), now(), '12345', 'Musterstadt', 'de', 'Mustergasse 122b', 'lorem ipsum', true,
        true, false, true, 'https://some.url', null, 1),
       ('Testevent online', 3, now(), now(), null, null, 'de', null, 'lorem ipsum', false,
        false, true, true, 'https://some.url', null, 1);


