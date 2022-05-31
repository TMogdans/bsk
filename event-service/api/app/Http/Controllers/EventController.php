<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\EventListResource;
use App\Http\Resources\EventResource;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventController extends Controller
{
    public function __construct(
        private EventService $eventService
    ) {
    }

    public function index(Request $request): JsonResource
    {
        $eventList = $this->eventService->getAllFuturePublishedEvents($request);

        return new EventListResource($eventList);
    }

    public function show(string $slug): JsonResource
    {
        $event = $this->eventService->getEventBySlug($slug);

        return new EventResource($event);
    }

    public function create(Request $request): JsonResource
    {
        $event = $this->eventService->create($request);

        return new EventResource($event);
    }
}
