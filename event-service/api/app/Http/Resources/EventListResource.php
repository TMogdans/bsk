<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventListResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'heading' => $this->resource->getHeading(),
            'months' => MonthResource::collection($this->resource->getMonths()),
        ];
    }
}
