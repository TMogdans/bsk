<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class EventService
{
    public function getAllFuturePublishedEvents(): Collection
    {
        return Event::where('published', true)
            ->whereDate('ends_at', '>=', Carbon::now())
            ->orderBy('begins_at', 'ASC')
            ->get();
    }
}
