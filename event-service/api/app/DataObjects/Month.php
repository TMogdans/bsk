<?php

declare(strict_types=1);

namespace App\DataObjects;

use App\Models\Event;

class Month
{
    public function __construct(
        private readonly string $heading,
        private array $events = []
    ) {
    }

    public function getHeading(): string
    {
        return $this->heading;
    }

    public function getEvents(): array
    {
        return $this->events;
    }

    public function addEvent(Event $event): self
    {
        $this->events[] = $event;

        return $this;
    }
}
