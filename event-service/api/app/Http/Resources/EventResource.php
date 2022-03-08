<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'name' => $this->name,
            'type' => $this->type,
            'beginsAt' => $this->begins_at,
            'endsAt' => $this->ends_at,
            'zip' => $this->zip,
            'location' => $this->location,
            'country' => $this->country,
            'street' => $this->street,
            'description' => $this->description,
            'barrierFree' => $this->barrier_free,
            'entryFree' => $this->entry_free,
            'onlineEvent' => $this->online_event,
            'eventUrl' => $this->event_url,
            'meta' => [
                'url' => sprintf('/events/%s', $this->slug),
            ]
        ];
    }
}
