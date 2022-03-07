<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\EventService;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    public function __construct(
        private EventService $eventService
    ) {
    }

    public function index(): JsonResponse
    {
        $events = $this->eventService->getAllFuturePublishedEvents();

        return new JsonResponse($events);
    }

    public function show(string $slug): JsonResponse
    {
        $event = $this->eventService->getEventBySlug($slug);

        return new JsonResponse($event);
    }
}
