<?php

declare(strict_types=1);

namespace Tests\Features;

use Faker\Provider\Lorem;
use Illuminate\Testing\Fluent\AssertableJson;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class EventsTest extends TestCase
{
    private const EVENT_OFFLINE_RESPONSE_BODY = [
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

    private const EVENT_ONLINE_RESPONSE_BODY = [
        'name',
        'type',
        'beginsAt',
        'endsAt',
        'country',
        'description',
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
                '*' => self::EVENT_OFFLINE_RESPONSE_BODY
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
            ->seeJsonStructure(self::EVENT_OFFLINE_RESPONSE_BODY);
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
            ->seeJsonStructure(self::EVENT_OFFLINE_RESPONSE_BODY);
    }

    public function test_it_creates_online_event_from_request(): void
    {
        $this->json('POST', '/api/events', [
            'name' => 'Testevent',
            'type' => 'convention',
            'beginsAt' => '2022-07-12',
            'endsAt' => '2022-07-13',
            'country' => 'de',
            'description' => Lorem::text(),
            'entryFree' => true,
            'onlineEvent' => true,
            'eventUrl' => 'https://some_url.com',
        ], [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ])
            ->seeStatusCode(Response::HTTP_CREATED)
            ->seeHeader('Content-Type', 'application/json')
            ->seeJsonStructure(self::EVENT_ONLINE_RESPONSE_BODY);
    }

    public function test_it_responds_with_400_on_missing_argument(): void
    {
        $this->json('POST', '/api/events', [
            'name' => 'Testevent',
            'type' => 'convention',
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
            ->seeStatusCode(Response::HTTP_BAD_REQUEST);
    }

    public function test_it_responds_offline_events_for_presence_filter_offline(): void
    {
        $this->json('GET', '/api/events?presence=offline', [], [
            'Accept' => 'application/json'
        ])
            ->seeHeader('Content-Type', 'application/json')
            ->seeStatusCode(Response::HTTP_OK)
            ->seeJsonDoesntContains([
                    'onlineEvent' => true
                ]);
    }

    public function test_it_responds_online_events_for_presence_filter_online(): void
    {
        $this->json('GET', '/api/events?presence=online', [], [
            'Accept' => 'application/json'
        ])
            ->seeHeader('Content-Type', 'application/json')
            ->seeStatusCode(Response::HTTP_OK)
            ->seeJsonDoesntContains([
                'onlineEvent' => false
            ]);
    }

    public function test_it_responds_convention_type_events_for_type_filter_convention(): void
    {
        $this->json('GET', '/api/events?type=convention', [], [
            'Accept' => 'application/json'
        ])
            ->seeHeader('Content-Type', 'application/json')
            ->seeStatusCode(Response::HTTP_OK)
            ->seeJsonDoesntContains([
                'type' => [
                    "name" => "fair"
                ]
            ])
            ->seeJsonDoesntContains([
                'type' => [
                    "name" => "tournament"
                ]
            ])
            ->seeJsonDoesntContains([
                'type' => [
                    "name" => "release"
                ]
            ])
            ->seeJsonDoesntContains([
                'type' => [
                    "name" => "award"
                ]
            ])
            ->seeJsonDoesntContains([
                'type' => [
                    "name" => "other"
                ]
            ]);
    }

    public function test_it_responds_barrier_free_events_for_barrier_free_filter_true(): void
    {
        $this->json('GET', '/api/events?barrierFree=true', [], [
            'Accept' => 'application/json'
        ])
            ->seeHeader('Content-Type', 'application/json')
            ->seeStatusCode(Response::HTTP_OK)
            ->seeJsonDoesntContains([
                'barrierFree' => false
            ]);
    }

    public function test_it_responds_not_barrier_free_events_for_barrier_free_filter_false(): void
    {
        $this->json('GET', '/api/events?barrierFree=false', [], [
            'Accept' => 'application/json'
        ])
            ->seeHeader('Content-Type', 'application/json')
            ->seeStatusCode(Response::HTTP_OK)
            ->seeJsonDoesntContains([
                'barrierFree' => true
            ]);
    }

    public function test_it_responds_entry_free_events_for_entry_free_filter_true(): void
    {
        $this->json('GET', '/api/events?entryFree=true', [], [
            'Accept' => 'application/json'
        ])
            ->seeHeader('Content-Type', 'application/json')
            ->seeStatusCode(Response::HTTP_OK)
            ->seeJsonDoesntContains([
                'entryFree' => false
            ]);
    }

    public function test_it_responds_not_entry_free_events_for_entry_free_filter_false(): void
    {
        $this->json('GET', '/api/events?entryFree=false', [], [
            'Accept' => 'application/json'
        ])
            ->seeHeader('Content-Type', 'application/json')
            ->seeStatusCode(Response::HTTP_OK)
            ->seeJsonDoesntContains([
                'entryFree' => true
            ]);
    }
}
