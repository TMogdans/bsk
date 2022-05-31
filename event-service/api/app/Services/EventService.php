<?php

declare(strict_types=1);

namespace App\Services;

use App\DataObjects\EventList;
use App\DataObjects\Month;
use App\Models\Event;
use App\Models\Type;
use App\Services\EventFilter\BarrierFreeFilter;
use App\Services\EventFilter\EntryFreeFilter;
use App\Services\EventFilter\PresenceFilter;
use App\Services\EventFilter\TypeFilter;
use App\Validators\EventValidator;
use App\Validators\FilterValidator;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use TMogdans\JsonApiProblemResponder\Exceptions\BadRequestException;
use TMogdans\JsonApiProblemResponder\Exceptions\NotFoundException;
use TMogdans\JsonApiProblemResponder\Exceptions\UnprocessableEntity;

class EventService
{

    public function getAllFuturePublishedEvents(Request $request): EventList
    {
        $year = 2022;
        $validator = (new FilterValidator())->getValidator($request);

        if ($validator->fails()) {
            $message = sprintf("Validator fails: %s", $validator->errors());

            Log::error($message);
            throw new BadRequestException($message, 'Invalid Argument');
        }

        $query = Event::with('type')
            ->where('published', true)
            ->whereDate('ends_at', '>=', Carbon::now())
            ->orderBy('begins_at', 'ASC');

        $this->applyFilter($request, $query);

        return new EventList(
            sprintf("Termine %d", $year),
            $this->getMonths($query->get(), $year)
        );
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
            throw new NotFoundException($message);
        }

        return $event;
    }

    public function create(Request $request): Event
    {
        $validator = (new EventValidator())->getValidator($request);

        if ($validator->fails()) {
            $message = sprintf("Validator fails: %s", $validator->errors());

            Log::error($message);
            throw new BadRequestException($message);
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
            throw new UnprocessableEntity($exception->getMessage());
        }

        return $event;
    }

    private function applyFilter(Request $request, Builder $query): void
    {
        if ($request->has('presence')) {
            (new PresenceFilter())->apply($query, $request);
        }

        if ($request->has('type')) {
            (new TypeFilter())->apply($query, $request);
        }

        if ($request->has('barrierFree')) {
            (new BarrierFreeFilter())->apply($query, $request);
        }

        if ($request->has('entryFree')) {
            (new EntryFreeFilter())->apply($query, $request);
        }
    }

    private function getMonths(Collection $result, int $year): Collection
    {

        $month = $result->first()->begins_at->month;
        $name = sprintf(
            "%s %d",
            $result->first()->begins_at->locale('de')->monthName,
            $year
        );
        $monthObject = new Month($name);
        $months = collect();

        foreach ($result as $event) {
            if ($event->begins_at->month !== $month) {
                $months->add($monthObject);
                $name = sprintf(
                    "%s %d",
                    $event->begins_at->locale('de')->monthName,
                    $year
                );
                $monthObject = new Month($event->begins_at->locale('de')->monthName);
                $month = $event->begins_at->month;
            }
            $monthObject->addEvent($event);
        }
        $months->add($monthObject);

        return $months;
    }
}
