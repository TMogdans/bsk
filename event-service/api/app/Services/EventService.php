<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Event;
use App\Models\Type;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
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

    public function create(Request $request): Event
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'type' => 'required|string|exists:types,name',
            'beginsAt' => 'required|date_format:Y-m-d',
            'endsAt' => 'required|date_format:Y-m-d',
            'zip' => 'string|required_if:onlineEvent,false',
            'location' => 'string|required_if:onlineEvent,false',
            'country' => 'required|string|size:2',
            'street' => 'string|required_if:onlineEvent,false',
            'description' => 'required|string',
            'barrierFree' => 'boolean|required_if:onlineEvent,false',
            'entryFree' => 'required|boolean',
            'onlineEvent' => 'required|boolean',
            'eventUrl' => 'required|url'
        ]);

        if ($validator->fails()) {
            $message = sprintf("Validator fails: %s", $validator->errors());

            Log::error($message);
            throw new \InvalidArgumentException($message);
        }

        $type = Type::where('name', $request->get('type'))->first();

        try {

            $eventData = [];
            foreach ($request->all() as $key => $item) {
                $eventData[Str::of($key)->snake()->toString()] = $item;
            }

            $eventData['type_id'] = $type->id;
            $eventData['created_by'] = 1;

            $event = Event::create($eventData);
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
        }

        return $event;
    }
}
