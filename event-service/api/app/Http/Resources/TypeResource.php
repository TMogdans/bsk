<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TypeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'name' => $this->name,
            'translation' => $this->translation,
        ];
    }
}
