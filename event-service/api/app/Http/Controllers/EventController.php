<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\EventResource;
use App\Services\EventService;
use Illuminate\Http\Resources\Json\JsonResource;

class EventController extends Controller
{
    public function __construct(
        private EventService $eventService
    ) {
    }

    public function index(): JsonResource
    {
        $events = $this->eventService->getAllFuturePublishedEvents();

        return EventResource::collection($events);
    }

    public function show(string $slug): JsonResource
    {
        $event = $this->eventService->getEventBySlug($slug);

        return new EventResource($event);
    }
}
