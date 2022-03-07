<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EventService
{
    public function getAllFuturePublishedEvents(): Collection
    {
        return Event::with('type')
            ->where('published', true)
            ->whereDate('ends_at', '>=', Carbon::now())
            ->orderBy('begins_at', 'ASC')
            ->get();
    }

    public function getEventBySlug(string $slug): Event
    {
        $event = Event::with('type')
            ->where('slug', $slug)
            ->where('published', true)
            ->whereDate('ends_at', '>=', Carbon::now())
            ->first();

        if (!$event instanceof Event) {
            $message = sprintf("No event found for slug %s", $slug);

            Log::info($message);
            throw new NotFoundHttpException($message);
        }

        return $event;
    }
}
