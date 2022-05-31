<?php

declare(strict_types=1);

namespace App\DataObjects;

use Illuminate\Support\Collection;

class EventList
{
    public function __construct(
        private readonly string $heading,
        private readonly Collection $months,
    ) {
    }

    public function getHeading(): string
    {
        return $this->heading;
    }

    public function getMonths(): Collection
    {
        return $this->months;
    }
}
