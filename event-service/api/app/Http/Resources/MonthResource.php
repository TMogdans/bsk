<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MonthResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'heading' => $this->resource->getHeading(),
            'events' => EventResource::collection($this->resource->getEvents())
        ];
    }
}
