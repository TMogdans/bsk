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
            'type' => new TypeResource($this->type),
            'beginsAt' => $this->begins_at,
            'endsAt' => $this->ends_at,
            'zip' => $this->whenNotNull($this->zip),
            'location' => $this->whenNotNull($this->location),
            'country' => $this->whenNotNull($this->country),
            'street' => $this->whenNotNull($this->street),
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
