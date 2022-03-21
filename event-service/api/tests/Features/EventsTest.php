<?php

declare(strict_types=1);

namespace Tests\Features;

use Faker\Provider\Lorem;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class EventsTest extends TestCase
{
    private const EVENT_RESPONSE_BODY = [
        'name',
        'type',
        'beginsAt',
        'endsAt',
        'zip',
        'location',
        'country',
        'street',
        'description',
        'barrierFree',
        'entryFree',
        'onlineEvent',
        'eventUrl',
        'meta' => [
            'url'
        ]
    ];

    public function test_it_returns_a_list_of_events(): void
    {
        $this->json('GET', '/api/events', [], [
            'Accept' => 'application/json'
        ])
            ->seeHeader('Content-Type', 'application/json')
            ->seeStatusCode(Response::HTTP_OK)
            ->seeJsonStructure([
                '*' => self::EVENT_RESPONSE_BODY
            ]);
    }

    public function test_it_returns_single_event_on_event_url(): void
    {
        $slug = 'testevent';

        $this->json('GET', sprintf('/api/events/%s', $slug), [], [
            'Accept' => 'application/json'
        ])
            ->seeStatusCode(Response::HTTP_OK)
            ->seeHeader('Content-Type', 'application/json')
            ->seeJsonStructure(self::EVENT_RESPONSE_BODY);
    }

    public function test_it_throws_exception_on_missing_event(): void
    {
        $slug = "slug-not-exist";

        $this->json('GET', sprintf('/api/events/%s', $slug), [], [
            'Accept' => 'application/json'
        ])
            ->seeStatusCode(Response::HTTP_NOT_FOUND);
    }

    public function test_it_creates_new_offline_event_from_request(): void
    {
        $this->json('POST', '/api/events', [
            'name' => 'Testevent',
            'type' => 'convention',
            'beginsAt' => '2022-07-12',
            'endsAt' => '2022-07-13',
            'zip' => '99999',
            'location' => 'Teststadt',
            'country' => 'de',
            'street' => 'Teststraße 42a',
            'description' => Lorem::text(),
            'barrierFree' => true,
            'entryFree' => true,
            'onlineEvent' => false,
            'eventUrl' => 'https://some_url.com',
        ], [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ])
            ->seeStatusCode(Response::HTTP_CREATED)
            ->seeHeader('Content-Type', 'application/json')
            ->seeJsonStructure(self::EVENT_RESPONSE_BODY);
    }
}
