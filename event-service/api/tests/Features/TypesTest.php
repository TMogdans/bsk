<?php

declare(strict_types=1);

namespace Tests\Features;

use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class TypesTest extends TestCase
{
    private const TYPES_RESPONSE_BODY = [
        'name',
    ];

    public function test_it_returns_a_list_of_types(): void
    {
        $this->json('GET', '/api/types', [], [
            'Accept' => 'application/json'
        ])
            ->seeHeader('Content-Type', 'application/json')
            ->seeStatusCode(Response::HTTP_OK)
            ->seeJsonStructure([
                '*' => self::TYPES_RESPONSE_BODY
            ]);
    }
}
